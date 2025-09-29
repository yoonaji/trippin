import React from 'react';
import * as S from '../../styles/Button.styles';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { colors } from '../../styles/colors';

type IconParam = {
  icon: any;
  onPress?: () => void;
  size?: number;
  color?: string; // 추가
};


const IconButton = ({ icon, onPress, size, color }: IconParam) => {
  return (
    <Pressable onPress={onPress}>
      <S.IconImage source={icon} size={size} color={color || colors.white} />
    </Pressable>
  );
};

export default IconButton;
