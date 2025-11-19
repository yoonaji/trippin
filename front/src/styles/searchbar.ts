import styled from 'styled-components/native';
import { colors } from './colors';

// 검색바 전체 컨테이너
export const SearchBarContainer = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: ${colors.white};  
    border-radius: 15px;
    padding: 8px 12px;
    margin: 20px 0 10px 0;
    elevation: 4;

`;

// 돋보기 아이콘 이미지
export const SearchIcon = styled.Image`
    width: 20px;
    height: 20px;
    tint-color: ${colors.gray8};  
`;

// 텍스트 입력창
export const SearchInput = styled.TextInput`
    flex: 1;
    font-size: 15px;
    color: ${colors.gray8};  
    padding: 0 8px;
    background-color: transparent;
`;

