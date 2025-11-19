import React, { useMemo, useState } from 'react';
import { Container } from '../../styles/GlobalStyles';
import CustomText from '../../components/ui/CustomText';
import { useNavigation } from '@react-navigation/native';
import { Text, View ,Image, ScrollView, TouchableOpacity, Modal, FlatList, Pressable, StyleSheet } from 'react-native';

import { Block, Header, UserInfo, ProfileImage, UserName, IconGroup, IconImage, ContentRow, LeftImage, InfoArea } from '../../styles/write.ts';
import heartIcon from '../../assets/images/icon/filledheart.png';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';
import chatIcon from '../../assets/images/icon/chat.png';
import { HeaderRow, IconCircle } from './InfoEditScreen.tsx'
import IconButton from '../../components/buttons/IconButton';
import record from '../../assets/images/icon/record.png';



  const posts = [
  {
    userName: '지윤아',
    location: '대전한화생명볼파크',
    date: '2025-03-04',
    text: '대전에 있는 야구장에 갔다. 야구장에 처음 가봤는데 생각했던 것 보다 재미있었다. 다음에 또...',
    image: require('../../assets/images/data/sample_stadium.png'),
  },
    {
    userName: '지윤아',
    location: '대전한화생명볼파크',
    date: '2025-03-04',
    text: '대전에 있는 야구장에 갔다. 야구장에 처음 가봤는데 생각했던 것 보다 재미있었다. 다음에 또...',
    image: require('../../assets/images/data/sample_stadium.png'),
    },
    {
    userName: '지윤아',
    location: '대전한화생명볼파크',
    date: '2025-03-04',
    text: '대전에 있는 야구장에 갔다. 야구장에 처음 가봤는데 생각했던 것 보다 재미있었다. 다음에 또...',
    image: require('../../assets/images/data/sample_stadium.png'),
    },
  ];



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

const RouteScreen = () => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const dropdownItems = useMemo(
    () => posts.map((p, i) => ({ label: `${p.location} · ${p.date}`, value: i })),
    []
  );

return ( 
<Container> 
  <ScrollView showsVerticalScrollIndicator={false}> 
    <HeaderRow> 
      <CustomText style={{ fontSize: 16, fontWeight: "700" ,color:colors.blue}}> 
        <FloatingButtonContainer> 
          <FloatingButtonWrapper> 
            <IconButton icon={record} size={25} /> 
            </FloatingButtonWrapper> 
            </FloatingButtonContainer> 
            내 여행기록 
            </CustomText> 
            </HeaderRow>


        <View style={{ marginHorizontal: 12, marginTop: 8 }}>
          <CustomDropdown
            items={dropdownItems}
            value={selectedPost}
            onChange={setSelectedPost}
            placeholder="포스팅을 선택하세요           "
          />
        </View>
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
