import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import { colors } from '../../styles/colors';
import place from '../../assets/images/icon/place.png';
import api from '../../../axiosConfig';
import { showError } from '../../utils/toast';
import { TouchableWithoutFeedback } from 'react-native';
import down from '../../assets/images/icon/down.png';

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
    <TouchableWithoutFeedback onPress={() => setOpenDropdown(false)}>
      <Container>
        <Scroll
          style={{ width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <HeaderRow>
            <IconCircle>
              <RouteIcon source={place} />
            </IconCircle>
          </HeaderRow>
          <Line />

          {loading ? (
            <Loader />
          ) : (
            <DropWrapper>
              <DropBox
                onPress={() => setOpenDropdown(prev => !prev)}
                active={openDropdown}
              >
                <DropText active={!!selectedRoute}>
                  {selectedRoute?.label || '여행 경로를 선택하세요'}
                </DropText>
                <DownIcon source={down} />
              </DropBox>

              {openDropdown && (
                <Dropdown>
                  <ScrollBox>
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
                  </ScrollBox>
                </Dropdown>
              )}
            </DropWrapper>
          )}
        </Scroll>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default RouteScreen;

const Scroll = styled.ScrollView``;

const HeaderRow = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  margin-top: 20px;
`;

const IconCircle = styled.View`
  width: 40px;
  height: 40px;
  background-color: ${colors.blue};
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`;

const RouteIcon = styled.Image`
  width: 25px;
  height: 25px;
  tint-color: ${colors.white};
`;

const Line = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${colors.gray3};
  margin-vertical: 8px;
`;

const Loader = styled.ActivityIndicator.attrs({
  size: 'large',
  color: colors.blue,
})`
  margin-top: 25px;
`;

const DropWrapper = styled.View`
  position: relative;
`;

const DropBox = styled.TouchableOpacity<{ active: boolean }>`
  border-width: 1px;
  border-radius: 20px;
  border-color: ${colors.gray2};
  background-color: ${colors.sky};
  padding: 12px 18px;
  justify-content: space-between;
  ${({ active }) =>
    active &&
    `
    border-color: ${colors.blue2};
  `}
  flex-direction: row;
  align-items: center;
`;

const DropText = styled(CustomText)<{ active: boolean }>`
  font-size: 14px;
  color: ${({ active }) => (active ? colors.gray7 : colors.gray4)};
`;

const DownIcon = styled.Image`
  width: 15px;
  height: 13px;
  tint-color: ${colors.gray6};
`;

const Dropdown = styled.View`
  position: absolute;
  top: 50px;
  width: 100%;
  background-color: ${colors.white};
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.gray2};
  z-index: 100;
  max-height: 200px;
  overflow: hidden;
  elevation: 4;
  shadow-color: #000;
  shadow-opacity: 0.12;
  shadow-radius: 6px;
`;

const ScrollBox = styled.ScrollView`
  max-height: 180px;
`;

const OptionButton = styled.TouchableOpacity`
  padding: 13px 18px;
`;

const OptionLabel = styled(CustomText)`
  font-size: 14px;
`;
