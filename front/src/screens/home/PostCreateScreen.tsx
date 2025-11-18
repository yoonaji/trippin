import CustomText from '../../components/ui/CustomText';
import { Container } from '../../styles/GlobalStyles';
import noImage from '../../assets/images/icon/no_image.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import place from '../../assets/images/icon/place.png';
import calendar from '../../assets/images/icon/calendar.png';
import content from '../../assets/images/icon/content.png';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useImagePicker } from '../../hooks/useImagePicker';
import { useRef, useState } from 'react';
import Carousel from '../../components/ui/Carousel';
import { Platform, View } from 'react-native';
import api from '../../../axiosConfig';
import Toast from 'react-native-toast-message';
import AddressSearchBox, {
  AddressSearchRef,
} from '../../components/ui/home/AddressSearchBox';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParam } from './HomeStack';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useLoading } from '../../components/ui/LoadingContext';
import { showError } from '../../utils/toast';
dayjs.locale('ko');

const sleep = (ms: number) =>
  new Promise<void>(res => setTimeout(() => res(), ms));

const withTimeout = <T,>(p: Promise<T>, ms = 15000) => {
  let t: any;
  const timer = new Promise<T>((_, rej) => {
    t = setTimeout(() => rej(new Error('TIMEOUT')), ms);
  });
  return Promise.race([p, timer]).finally(() => clearTimeout(t));
};

const uploadWithRetry = async (
  url: string,
  blob: Blob,
  contentType: string,
  tries = 2,
) => {
  let lastErr: any;
  for (let attempt = 0; attempt <= tries; attempt++) {
    try {
      const res = await withTimeout(
        fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': contentType },
          body: blob,
        }),
        20000,
      );
      if (!('ok' in res) || !(res as any).ok) {
        const status = (res as any)?.status ?? 'UNKNOWN';
        throw new Error(`HTTP_${status}`);
      }
      return;
    } catch (e) {
      lastErr = e;
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastErr;
};

const PostCreateScreen = () => {
  const insets = useSafeAreaInsets();
  const { pickImages } = useImagePicker();
  const addressRef = useRef<AddressSearchRef>(null);
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParam>>();

  const [selectedImages, setSelectedImages] = useState<
    { uri: string; fileName: string; type: string }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [photoInfos, setPhotoInfos] = useState<
    {
      imageUrl?: string;
      place: string;
      date: string;
      buildingName: string;
      content: string;
    }[]
  >([]);

  const [isEditingPlace, setIsEditingPlace] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const { setLoadingPromise } = useLoading();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return dayjs(d).format('YY.MM.DD A h:mm');
  };

  const handleInfoChange = (
    key: 'place' | 'date' | 'buildingName' | 'content',
    value: string,
  ) => {
    setPhotoInfos(prev => {
      const next = [...prev];
      const cur = next[activeIndex] ?? {
        place: '',
        date: '',
        buildingName: '',
        content: '',
      };
      next[activeIndex] = { ...cur, [key]: value };
      return next;
    });
  };

  const handleSelectImage = async () => {
    const images = await pickImages(true, 30);

    if (images.length === 0) {
      showError('E_PICKER_EMPTY', '선택한 사진이 없습니다.');
      return;
    }

    if (images.length === 0) {
      showError('선택 취소', '기존 이미지를 유지합니다.');
      return;
    }

    setActiveIndex(0);
    setSelectedImages(images);
    setPhotoInfos([]);
    try {
      const completeData = await setLoadingPromise(
        (async () => {
          const presignRes = await withTimeout(
            api.post(
              '/api/photos/upload?presign',
              images.map(img => ({
                filename: img.fileName,
                contentType: img.type,
              })),
            ),
            15000,
          );

          const presigned = presignRes.data?.data ?? [];
          if (!Array.isArray(presigned) || presigned.length !== images.length) {
            throw new Error('LENGTH_MISMATCH');
          }

          for (let i = 0; i < presigned.length; i++) {
            const image = images[i];
            const res = await fetch(image.uri);
            const blob = await res.blob();
            await uploadWithRetry(presigned[i].uploadUrl, blob, image.type);
          }

          const objectKeys = presigned.map(p => p.objectKey);
          const completeRes = await withTimeout(
            api.post('/api/photos/upload?complete', objectKeys),
            15000,
          );

          return completeRes.data?.data ?? [];
        })(),
        '사진 불러오는 중...',
      );

      if (!Array.isArray(completeData)) throw new Error('INVALID_RESPONSE');

      setPhotoInfos(
        completeData.map(info => ({
          imageUrl: info.imageUrl,
          place:
            info.address && info.address !== '위치 정보 없음'
              ? info.address
              : '',
          date: info.takenAt
            ? new Date(info.takenAt).toISOString().split('T')[0]
            : '',
          buildingName: '',
          content: '',
        })),
      );
    } catch (e) {
      showError('E_UPLOAD_FAIL', '이미지 업로드 중 문제가 발생했습니다.');
    }
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: photoInfos[activeIndex]?.date
          ? new Date(photoInfos[activeIndex]?.date)
          : new Date(),
        mode: 'date',
        is24Hour: false,
        onChange: (event, selectedDate) => {
          if (event.type === 'set' && selectedDate) {
            DateTimePickerAndroid.open({
              value: selectedDate,
              mode: 'time',
              is24Hour: false,
              onChange: (e2, selectedTime) => {
                if (e2.type === 'set' && selectedTime) {
                  const merged = new Date(selectedDate);
                  merged.setHours(selectedTime.getHours());
                  merged.setMinutes(selectedTime.getMinutes());
                  const local = dayjs(merged).format('YYYY-MM-DDTHH:mm:ss');
                  handleInfoChange('date', local);
                }
              },
            });
          }
        },
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const handleNext = () => {
    if (selectedImages.length === 0 || photoInfos.length === 0) {
      showError('이미지 없음', '사진을 선택해주세요.');
      return;
    }

    const invalidIndex = photoInfos.findIndex(
      p => !p.place.trim() || !p.date.trim(),
    );

    if (invalidIndex !== -1) {
      showError(
        '입력 누락',
        `${invalidIndex + 1}번째 사진의 주소와 날짜를 모두 입력해주세요.`,
      );
      return;
    }

    const formattedPhotos = photoInfos.map(p => ({
      imageUrl: p.imageUrl ?? '',
      content: p.content.trim(),
      address: p.place.trim(),
      buildingName: p.buildingName.trim(),
      takenAt: p.date ? new Date(p.date).toISOString() : null,
    }));

    const postData = {
      title: '제목을 입력하세요',
      photos: formattedPhotos,
    };

    navigation.navigate('PostConfirmScreen', { postData });
  };

  return (
    <Container style={{ paddingBottom: insets.bottom + 10 }}>
      {selectedImages.length === 0 ? (
        <ImageSelectWrapper>
          <ImageSection>
            <ImageIcon source={noImage} />
          </ImageSection>
          <DotContainer>
            {[1, 2, 3, 4, 5].map((_, idx) => (
              <Dot key={idx} />
            ))}
          </DotContainer>
          <ImageSelectButton onPress={handleSelectImage}>
            <ButtonText>사진 선택</ButtonText>
          </ImageSelectButton>
        </ImageSelectWrapper>
      ) : (
        <ImageSelectWrapper>
          <View style={{ height: 230 }}>
            <Carousel
              images={selectedImages}
              itemSize={230}
              onIndexChange={index => setActiveIndex(index)}
            />
          </View>
          <DotContainer>
            {selectedImages.map((_, idx) => (
              <Dot key={idx} active={idx === activeIndex} />
            ))}
          </DotContainer>
          <ImageSelectButton onPress={handleSelectImage}>
            <ButtonText>다시 선택</ButtonText>
          </ImageSelectButton>
        </ImageSelectWrapper>
      )}
      {selectedImages.length > 0 && (
        <>
          <InfoSection>
            <PlaceInfo>
              <Row>
                <IconWrapper>
                  <Icon source={place} />
                </IconWrapper>
                <Column>
                  {selectedImages.length > 0 && (
                    <>
                      {photoInfos[activeIndex]?.place ? (
                        <>
                          {isEditingPlace ||
                          !photoInfos[activeIndex]?.buildingName ? (
                            <StyledPlaceInput
                              placeholder="장소명을 입력하세요"
                              value={photoInfos[activeIndex]?.buildingName}
                              onChangeText={text =>
                                handleInfoChange('buildingName', text)
                              }
                              onFocus={() => setIsEditingPlace(true)}
                              onBlur={() => setIsEditingPlace(false)}
                              multiline={false}
                              submitBehavior="blurAndSubmit"
                              returnKeyType="done"
                            />
                          ) : (
                            <BuildingNameText
                              onPress={() => setIsEditingPlace(true)}
                            >
                              {photoInfos[activeIndex]?.buildingName}
                            </BuildingNameText>
                          )}

                          <AddressText>
                            {photoInfos[activeIndex]?.place}
                          </AddressText>

                          <ReSearchButton
                            onPress={() => addressRef.current?.open()}
                          >
                            <ReSearchText>주소 재검색</ReSearchText>
                          </ReSearchButton>
                        </>
                      ) : (
                        <>
                          <SearchButton
                            onPress={() => addressRef.current?.open()}
                          >
                            <SearchText>주소 검색</SearchText>
                          </SearchButton>
                        </>
                      )}
                      <AddressSearchBox
                        ref={addressRef}
                        onSelect={(mainAddress, buildingName, zonecode) => {
                          setPhotoInfos(prev => {
                            const next = [...prev];
                            const cur = next[activeIndex] ?? {
                              place: '',
                              date: '',
                              buildingName: '',
                              content: '',
                            };
                            next[activeIndex] = {
                              ...cur,
                              place: mainAddress,
                              buildingName,
                            };
                            return next;
                          });
                        }}
                      />
                    </>
                  )}
                </Column>
              </Row>
            </PlaceInfo>

            <DateInfo>
              <Row>
                <IconWrapper>
                  <Icon source={calendar} />
                </IconWrapper>
                {selectedImages.length === 0 ? (
                  <></>
                ) : photoInfos[activeIndex]?.date ? (
                  <>
                    <DateDiplayButton
                      onPress={() => {
                        if (Platform.OS === 'android') {
                          handleOpenDatePicker();
                        } else {
                          setShowDatePicker(true);
                        }
                      }}
                    >
                      <DateDisplayText>
                        {formatDate(photoInfos[activeIndex]?.date)}
                      </DateDisplayText>
                    </DateDiplayButton>
                  </>
                ) : (
                  <>
                    <DateSelectButton onPress={handleOpenDatePicker}>
                      <DateText>날짜 선택</DateText>
                    </DateSelectButton>
                  </>
                )}
              </Row>

              {Platform.OS === 'ios' && showDatePicker && (
                <DateTimePicker
                  value={
                    photoInfos[activeIndex]?.date
                      ? new Date(photoInfos[activeIndex]?.date)
                      : new Date()
                  }
                  mode="datetime"
                  is24Hour={false}
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      const local = dayjs(selectedDate).format(
                        'YYYY-MM-DDTHH:mm:ss',
                      );
                      handleInfoChange('date', local);
                    }
                  }}
                />
              )}
            </DateInfo>

            <ContentInfo>
              <Row>
                <IconWrapper>
                  <Icon source={content} />
                </IconWrapper>
                <Column style={{ flex: 1 }}>
                  {isEditingContent || !photoInfos[activeIndex]?.content ? (
                    <StyledInput
                      placeholder={
                        selectedImages.length > 0 ? '내용을 입력하세요' : ''
                      }
                      value={
                        selectedImages.length > 0
                          ? photoInfos[activeIndex]?.content
                          : ''
                      }
                      editable={selectedImages.length > 0}
                      onChangeText={text => handleInfoChange('content', text)}
                      multiline
                      onFocus={() => setIsEditingContent(true)}
                      onBlur={() => setIsEditingContent(false)}
                      submitBehavior="blurAndSubmit"
                      returnKeyType="done"
                    />
                  ) : (
                    <GrayContentText onPress={() => setIsEditingContent(true)}>
                      {photoInfos[activeIndex]?.content}
                    </GrayContentText>
                  )}
                </Column>
              </Row>
            </ContentInfo>
          </InfoSection>

          <PrimaryButton title="완료" onPress={handleNext} />
        </>
      )}
    </Container>
  );
};

export default PostCreateScreen;

const ImageSelectWrapper = styled.View`
  gap: 12px;
  align-items: center;
  margin-top: 18px;
`;

const ImageSection = styled.View`
  width: 230px;
  height: 230px;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  border: 1px solid ${colors.gray5};
  background: ${colors.white};
`;

const ImageIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const DotContainer = styled.View`
  flex-direction: row;
  gap: 6px;
`;

const Dot = styled.View<{ active?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 8px;
  background: ${({ active }) => (active ? colors.gray6 : colors.gray2)};
`;

const ImageSelectButton = styled.Pressable`
  width: 110px;
  height: 35px;
  background: ${colors.blue2};
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled(CustomText)`
  font-size: 11px;
  font-weight: 500;
  color: ${colors.white};
`;

const InfoSection = styled.View`
  width: 100%;
  flex: 1;
  gap: 16px;
  margin-top: 38px;
  margin-bottom: 20px;
`;

const PlaceInfo = styled.View`
  width: 100%;
  min-height: 48px;
  border-radius: 10px;
  background-color: ${colors.white};
  padding: 10px 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 4;
`;

const BuildingNameText = styled(CustomText)`
  padding-top: 4px;
  font-size: 15px;
  font-weight: 600;
  color: ${colors.gray5};
`;

const AddressText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray5};
  margin-vertical: 5px;
`;

const ReSearchButton = styled.Pressable`
  align-self: flex-start;
  padding-vertical: 4px;
  padding-horizontal: 10px;
  border-radius: 8px;
  background-color: ${colors.gray1};
  margin-top: 3px;
`;

const ReSearchText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray7};
`;

const SearchButton = styled.Pressable`
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 10px;
  background-color: ${colors.gray1};
`;

const SearchText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray8};
`;

const DateInfo = styled.View`
  width: 100%;
  min-height: 48px;
  border-radius: 10px;
  background-color: ${colors.white};
  padding: 4px 12px 4px 12px;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 4;
`;

const DateDiplayButton = styled.Pressable`
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 10px;
  background-color: ${colors.gray1};
`;

const DateDisplayText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray8};
`;

const DateSelectButton = styled.Pressable`
  padding-vertical: 8px;
  padding-horizontal: 12px;
  border-radius: 10px;
  background-color: ${colors.gray1};
`;

const DateText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray8};
`;

const ContentInfo = styled.View`
  width: 100%;
  flex: 1;
  border-radius: 10px;
  background-color: ${colors.white};
  padding-horizontal: 12px;
  padding-top: 8px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 4;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 6px;
`;

const Column = styled.View`
  flex-direction: column;
`;

const IconWrapper = styled.View`
  padding-top: 6px;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

const StyledInput = styled.TextInput.attrs({
  placeholderTextColor: colors.gray5,
})`
  font-size: 11px;
  font-weight: 500;
  line-height: 13px;
`;

const StyledPlaceInput = styled.TextInput.attrs({
  placeholderTextColor: colors.gray5,
})`
  font-size: 15px;
  font-weight: 500;
  line-height: 17px;
  padding-top: 7px;
  padding-bottom: 3px;
`;

const GrayContentText = styled(CustomText)`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.gray5};
  line-height: 17px;
  padding-top: 7px;
`;
