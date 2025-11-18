import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { HomeStackParam } from './HomeStack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Image, View } from 'react-native';
import CustomText from '../../components/ui/CustomText';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import api from '../../../axiosConfig';
import Toast from 'react-native-toast-message';
import { Container } from '../../styles/GlobalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import Carousel from '../../components/ui/Carousel';
import place from '../../assets/images/icon/place.png';
import calendar from '../../assets/images/icon/calendar.png';
import content from '../../assets/images/icon/content.png';
import edit from '../../assets/images/icon/edit.png';
import { useState } from 'react';
import dayjs from 'dayjs';

type Photo = {
  imageUrl: string;
  content: string;
  address: string;
  buildingName: string;
  takenAt: string | null;
};

type PostData = {
  title: string;
  photos: Photo[];
};

type PostConfirmRoute = RouteProp<HomeStackParam, 'PostConfirmScreen'>;

const PostConfirmScreen = () => {
  const insets = useSafeAreaInsets();
  const { params } = useRoute<PostConfirmRoute>();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParam>>();
  const { postData } = params as { postData: PostData };
  const [activeIndex, setActiveIndex] = useState(0);
  const [title, setTitle] = useState(postData.title || '');

  const handleSubmit = async () => {
    try {
      const finalData = { ...postData, title };
      await api.post('/api/posts', finalData);
      Toast.show({
        type: 'success',
        text1: '게시물 등록 완료',
        text2: '등록된 게시물은 마이페이지에서 확인할 수 있습니다.',
      });
      navigation.popToTop();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: '등록 실패',
        text2: '다시 시도해주세요.',
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '날짜 없음';
    return dayjs(dateString).format('YY.MM.DD A h:mm');
  };

  const activePhoto = postData.photos[activeIndex];

  return (
    <Container style={{ flex: 1, paddingBottom: insets.bottom + 10 }}>
      <Wrapper>
        <TitleSection>
          <TitleIcon source={edit} />
          <TitleInput
            placeholder="제목을 입력하세요"
            value={title}
            onChangeText={setTitle}
          />
        </TitleSection>

        <View style={{ height: 200, marginVertical: 16 }}>
          <Carousel
            images={postData.photos.map(p => ({ uri: p.imageUrl }))}
            itemSize={200}
            onIndexChange={index => setActiveIndex(index)}
          />
        </View>

        <DotContainer>
          {postData.photos.map((_, idx) => (
            <Dot key={idx} active={idx === activeIndex} />
          ))}
        </DotContainer>

        <InfoCard>
          <Row>
            <Icon source={place} />
            <Column>
              <PlaceTitle>
                {activePhoto.buildingName || activePhoto.address || '주소 없음'}
              </PlaceTitle>
              <PlaceSubText>
                {activePhoto.address
                  ? activePhoto.address
                  : '주소 정보가 없습니다.'}
              </PlaceSubText>
            </Column>
          </Row>
        </InfoCard>

        <InfoCard>
          <Row>
            <Icon source={calendar} />
            <DateText>{formatDate(activePhoto.takenAt)}</DateText>
          </Row>
        </InfoCard>

        <ContentCard>
          <Row>
            <Icon source={content} />
            <Column style={{ flex: 1 }}>
              <ContentText>{activePhoto.content || ''}</ContentText>
            </Column>
          </Row>
        </ContentCard>
      </Wrapper>

      <PrimaryButton title="작성하기" onPress={handleSubmit} />
    </Container>
  );
};

export default PostConfirmScreen;

const Wrapper = styled.View`
  width: 100%;
  border-radius: 16px;
  background-color: #ecf5fc;
  padding: 20px;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  flex: 1;
  margin-bottom: 32px;
`;

const TitleSection = styled.View`
  flex-direction: row;
  gap: 5px;
  padding-top: 3px;
`;

const TitleIcon = styled.Image`
  width: 24px;
  height: 24px;
`;

const TitleInput = styled.TextInput.attrs({
  placeholderTextColor: colors.gray5,
})`
  font-size: 18px;
  font-weight: 600;
  color: ${colors.gray7};
  margin-bottom: 10px;
  padding-top: 1px;
  padding-bottom: 0;
`;

const InfoCard = styled.View`
  background-color: ${colors.white};
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 3;
`;

const ContentCard = styled(InfoCard)`
  flex: 1;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
`;

const Column = styled.View`
  flex-direction: column;
  flex: 1;
`;

const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

const PlaceTitle = styled(CustomText)`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.gray8};
`;

const PlaceSubText = styled(CustomText)`
  font-size: 12px;
  color: ${colors.gray5};
  margin-top: 2px;
`;

const DateText = styled(CustomText)`
  font-size: 13px;
  color: ${colors.gray7};
`;

const ContentText = styled(CustomText)`
  font-size: 13px;
  color: ${colors.gray7};
  line-height: 18px;
`;

const DotContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  gap: 6px;
  margin-bottom: 16px;
`;

const Dot = styled.View<{ active?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 8px;
  background: ${({ active }) => (active ? colors.gray6 : colors.gray2)};
`;
