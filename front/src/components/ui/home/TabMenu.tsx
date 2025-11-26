import { useState } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import CustomText from '../CustomText';
import { colors } from '../../../styles/colors';

type TabType = 'popular' | 'route' | 'favorite';
type Props = {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
};

const TabMenu = ({ activeTab, onChange }: Props) => {
  return (
    <>
      <TabWrapper>
        <TabButton
          active={activeTab == 'popular'}
          onPress={() => onChange('popular')}
        >
          <TabLabel weight={activeTab === 'popular' ? '600' : '400'}>
            인기 장소
          </TabLabel>
        </TabButton>
        <TabButton
          active={activeTab == 'route'}
          onPress={() => onChange('route')}
        >
          <TabLabel weight={activeTab === 'route' ? '600' : '400'}>
            여행 경로
          </TabLabel>
        </TabButton>
        <TabButton
          active={activeTab == 'favorite'}
          onPress={() => onChange('favorite')}
        >
          <TabLabel weight={activeTab === 'favorite' ? '600' : '400'}>
            찜한 장소
          </TabLabel>
        </TabButton>
      </TabWrapper>
    </>
  );
};

export default TabMenu;

const TabWrapper = styled.View`
  position: absolute;
  top: 0;
  z-index: 15;
  width: 100%;
  height: 45px;
  flex-direction: row;
  background-color: ${colors.white};
`;

const TabButton = styled.Pressable<{ active: boolean }>`
  height: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-bottom-width: 5px;
  border-bottom-color: ${({ active }) => (active ? colors.blue : colors.gray1)};
`;

const TabLabel = styled(CustomText)`
  font-size: 13px;
`;
