import styled from 'styled-components/native';
import { colors } from './colors';

export const Block = styled.View`
    width: 100%;
    padding: 20px;
    margin: 5px 0;
    background-color: ${colors.sky};
    border-radius: 24px;
    elevation: 4;

`;

export const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between; /* 헤더 안 요소 좌우 정렬 */
    padding: 0 5px;
`;

export const UserInfo = styled.View`
    flex-direction: row;
    align-items: center;
    flex: 1; /* 왼쪽 영역 넓게 잡기 */
`;

export const ProfileImage = styled.Image`
    width: 30px;
    height: 30px;
    border-radius: 24px;
`;

export const UserName = styled.Text`
    margin-left: 12px;
    font-weight: bold;
    font-size: 14px;
`;

export const IconGroup = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-end; /* 오른쪽 정렬 */
    gap: 20px;
`;

export const IconImage = styled.Image`
    width: 25px;
    height: 25px;
`;


export const ItemContainer = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 12px 0; 
    border-bottom-width: 0.5px;
    border-color: ${colors.gray2};  
`;

export const ContentRow = styled.View`
    flex-direction: row;
    align-items: flex-start;
`;

export const LeftImage = styled.Image`
    width: 100px;
    height: 100px;
    border-radius: 8px;

`;

export const InfoArea = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
`;
