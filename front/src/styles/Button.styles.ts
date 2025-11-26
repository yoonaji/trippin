import styled from 'styled-components/native';
import { colors } from './colors';
import CustomText from '../components/ui/CustomText';
import { Pressable } from 'react-native';

interface WrapperProps {
  backgroundColor?: string;
}

export const PrimaryWrapper = styled(Pressable)<WrapperProps>`
  background-color: ${({ backgroundColor }) => backgroundColor || colors.blue};
  width: 100%;
  height: 55px;
  padding: 19px 0;
  border-radius: 15px;
  justify-content: center;
  align-items: center;
`;

export const SelectWrapper = styled.Pressable<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? 'd9d9d9' : 'white')};
  padding: 7px 20px;
  height: 34px;
  border-radius: 60px;
  justify-content: center;
  align-items: center;
  border: ${({ isSelected }) =>
    isSelected ? 'none' : `1px solid ${colors.green}`};
`;

export const SelectText = styled(CustomText).attrs({
  weight: '500',
})<{ isSelected?: boolean }>`
  font-size: 13px;
  color: ${({ isSelected }) => (isSelected ? colors.gray8 : colors.gray5)};
`;

export const ButtonText = styled(CustomText)<{ weight?: string }>`
  font-size: 15px;
  color: ${colors.gray6};
  font-weight: ${({ weight }) => weight || '500'};
`;

export const IconImage = styled.Image<{ size?: number }>`
  width: ${({ size }) => size ?? 20}px;
  height: ${({ size }) => size ?? 20}px;
  resize-mode: contain;
`;
