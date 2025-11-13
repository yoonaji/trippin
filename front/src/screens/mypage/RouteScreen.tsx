import React, { useMemo, useState, useEffect } from 'react'; 
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
// import { useNavigation } from '@react-navigation/native'; 
import {
  Text,
  View,
  // Image, 
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  Platform, //  Platform 추가
  ActivityIndicator, //  ActivityIndicator 추가
} from 'react-native';

// import { Block, Header, UserInfo, ProfileImage, UserName, IconGroup, IconImage, ContentRow, LeftImage, InfoArea } from '../../styles/write.ts';
// import heartIcon from '../../assets/images/icon/filledheart.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
// import chatIcon from '../../assets/images/icon/chat.png';
import { HeaderRow } from './InfoEditScreen.tsx'; // IconCircle 제거 (미사용)
import IconButton from '../../components/buttons/IconButton';
import record from '../../assets/images/icon/record.png';

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


function CustomDropdown({
  items,
  value,
  onChange,
  placeholder = '',
}: {
  items: { label: string; value: number }[];
  value: number | null | undefined;
  onChange: (v: number | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(
    () => items.find(i => i.value === value)?.label,
    [items, value]
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={styles.dropdownBox}
      >
        <Text style={[styles.dropdownText, !selectedLabel && { color: colors.gray2 }]}>
          {selectedLabel ?? placeholder}
        </Text>
        <Text style={styles.caret}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        {/* 배경 클릭 시 닫힘 */}
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />
        {/* 옵션 시트 */}
        <View style={styles.sheet}>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => { onChange(item.value); setOpen(false); }}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={<View style={{ height: 6 }} />}
          />
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setOpen(false)}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ5b29ubl9fYUBnbWFpbC5jb20iLCJjYXRlZ29yeSI6ImFjY2VzcyIsImlhdCI6MTc2MzAwNjExNCwiZXhwIjoxNzYzMDA3MDE0fQ.KD0LllVFEjKor7iQkHxsI0ikcfqMNQ9BBlC1vHJQ63E';


const RouteScreen = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/users/me/routes`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json.data)) {
          setRoutes(json.data);
        } else {
          console.error('API Error:', json?.message ?? res.status);
        }
      } catch (error) {
        console.error('Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);


  const dropdownItems = useMemo(
    () => routes.map(route => ({
      label: route.routeName || route.title, // routeName을 기본으로 사용
      value: route.routeId,
    })),
    [routes]
  );

return ( 
<Container> 
  <ScrollView showsVerticalScrollIndicator={false}> 
    <HeaderRow> 
      <CustomText style={{ fontSize: 16, fontWeight: "700" ,color:colors.blue}}> 
        <FloatingButtonContainer> 
          <FloatingButtonWrapper> 
            <IconButton icon={record} size={15} /> 
            </FloatingButtonWrapper> 
            </FloatingButtonContainer> 
            내 여행기록 
            </CustomText> 
            </HeaderRow>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} color={colors.blue} />
      ) : (
        <View style={{ marginHorizontal: 12, marginTop: 8 }}>
          <CustomDropdown
            items={dropdownItems}
            value={selectedRouteId} //  상태 변수명 변경
            onChange={setSelectedRouteId} //  상태 변수명 변경
            placeholder="여행 경로를 선택하세요           " //  placeholder 수정
          />
        </View>
      )}
    </ScrollView>
  </Container>
  );
};

const styles = StyleSheet.create({
  dropdownBox: {
    borderWidth: 1,
    borderColor: colors.gray1,
    borderRadius: 20,
    backgroundColor: colors.sky,
    paddingVertical: 10,
    paddingHorizontal: 85,
  },
  dropdownText: {
    fontSize: 14,
    paddingRight: 1, // caret과 겹치지 않도록
  },
  caret: {
    position: 'absolute',
    right: 12,
    top: 12,
    fontSize: 14,
    opacity: 0.6,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  sheet: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: 120, // 드롭다운 바로 아래 정도로
    borderRadius: 10,
    backgroundColor: colors.gray1,
    paddingVertical: 6,
  },
  optionRow: {
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionText: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  cancelBtn: {
    marginTop: 4,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: colors.gray2,
  },
});

  // 버튼 컨테이너
const FloatingButtonContainer = styled.View`
  position: absolute;
  bottom: 8px;
  right: 30px;
  flex-direction: column;
  align-items: center;
`;

const FloatingButtonWrapper = styled.View`
  background-color:  ${colors.blue};
  width: 35px;
  height: 35px;
  border-radius: 35px;
  justify-content: center;
  align-items: center;
  margin-bottom: -10px; 
  margin-right: 10px; 

`;


export default RouteScreen;