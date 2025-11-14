import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import IconButton from '../../components/buttons/IconButton';
import { colors } from '../../styles/colors';
import place from '../../assets/images/icon/place.png';
import api from '../../../axiosConfig';
import { showError } from '../../utils/toast';

type Marker = {
  id: number;
  placeName: string;
  lat: number;
  lng: number;
  photoCount: number;
  orderIndex: number;
};

type Route = {
  routeId: number;
  routeName: string;
  title: string;
  startDate: string;
  endDate: string;
  markers: Marker[];
};

const RouteScreen = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await api.get('/api/users/me/routes');
        const list = res.data?.data ?? [];

        if (!Array.isArray(list)) throw new Error('INVALID_RESPONSE');

        setRoutes(list);
      } catch (e: any) {
        showError('여행 기록 조회 실패', e.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const dropdownItems = useMemo(
    () =>
      routes.map(r => ({
        label: r.routeName || r.title,
        value: r.routeId,
      })),
    [routes],
  );

  const selectedRoute = dropdownItems.find(i => i.value === selectedRouteId);

  return (
    <Container>
      <Scroll>
        <HeaderRow>
          <HeaderTitle>
            <FloatingContainer>
              <FloatingButton>
                <IconButton icon={place} size={16} />
              </FloatingButton>
            </FloatingContainer>
            내 여행기록
          </HeaderTitle>
        </HeaderRow>

        {loading ? (
          <Loader />
        ) : (
          <DropWrapper>
            <DropBox onPress={() => setOpenDropdown(true)}>
              <DropText active={!!selectedRoute}>
                {selectedRoute?.label || '여행 경로를 선택하세요'}
              </DropText>
              <Caret>▼</Caret>
            </DropBox>
          </DropWrapper>
        )}

        <ModalBox visible={openDropdown} transparent animationType="fade">
          <ModalBackground onPress={() => setOpenDropdown(false)} />
          <Sheet>
            {dropdownItems.map(item => (
              <OptionButton
                key={item.value}
                onPress={() => {
                  setSelectedRouteId(item.value);
                  setOpenDropdown(false);
                }}
              >
                <OptionLabel>{item.label}</OptionLabel>
              </OptionButton>
            ))}

            <CancelButton onPress={() => setOpenDropdown(false)}>
              <CancelText>취소</CancelText>
            </CancelButton>
          </Sheet>
        </ModalBox>
      </Scroll>
    </Container>
  );
};

export default RouteScreen;

const Scroll = styled.ScrollView``;

const HeaderRow = styled.View`
  margin: 20px 0 12px;
`;

const HeaderTitle = styled(CustomText)`
  font-size: 16px;
  font-weight: 700;
  color: ${colors.blue};
`;

const FloatingContainer = styled.View`
  position: absolute;
  right: 28px;
  bottom: 6px;
`;

const FloatingButton = styled.View`
  background-color: ${colors.blue};
  width: 35px;
  height: 35px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const Loader = styled.ActivityIndicator.attrs({
  size: 'large',
  color: colors.blue,
})`
  margin-top: 25px;
`;

const DropWrapper = styled.View`
  margin: 0 14px;
`;

const DropBox = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: 20px;
  border-color: ${colors.gray2};
  background-color: ${colors.sky};
  padding: 12px 18px;
  justify-content: center;
`;

const DropText = styled(CustomText)<{ active: boolean }>`
  font-size: 14px;
  color: ${({ active }) => (active ? colors.gray7 : colors.gray4)};
`;

const Caret = styled.Text`
  position: absolute;
  right: 16px;
  top: 14px;
  font-size: 13px;
  color: ${colors.gray5};
`;

const ModalBox = styled.Modal``;

const ModalBackground = styled.Pressable`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.25);
`;

const Sheet = styled.View`
  position: absolute;
  left: 14px;
  right: 14px;
  top: 130px;
  background-color: ${colors.white};
  border-radius: 14px;
  padding: 8px 0;
`;

const OptionButton = styled.TouchableOpacity`
  padding: 13px 18px;
`;

const OptionLabel = styled(CustomText)`
  font-size: 14px;
`;

const CancelButton = styled.TouchableOpacity`
  padding: 14px;
  align-items: center;
`;

const CancelText = styled(CustomText)`
  color: ${colors.gray5};
`;
