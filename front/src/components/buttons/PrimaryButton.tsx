import React from 'react';
import * as S from '../../styles/Button.styles';

interface Props {
  title: string;
  onPress?: () => void;
  color?: string;
  fontWeight?: string;
}

const PrimaryButton = ({ title, onPress, color, fontWeight }: Props) => {
  return (
    <S.PrimaryWrapper onPress={onPress} backgroundColor={color}>
      <S.ButtonText weight={fontWeight || '500'}>{title}</S.ButtonText>
    </S.PrimaryWrapper>
  );
};

export default PrimaryButton;
