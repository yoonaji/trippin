import styled from 'styled-components/native';
import { colors } from '../styles/colors';

export const ButtonBase = styled.TouchableOpacity`
    min-width: 60px;
    height: 32px;
    border-radius: 16px;
    justify-content: center;
    align-items: center;
    margin-left: 6px;
    padding: 0 12px;
`;
export const ItemContainer = styled.View`
    flex-direction: row;
    align-items: center;
    padding: 12px 0;
    border-bottom-width: 0.5px;
    border-color: ${colors.gray2};  
`;

export const UserName = styled.Text`
    flex: 1;
    font-weight: bold;
    font-size: 16px;
    color: ${colors.gray8}; 
`;


export const AcceptButton = styled(ButtonBase)`
    background: ${colors.blue};    
`;

export const RejectButton = styled(ButtonBase)`
    background: ${colors.white}; 
    border-color: ${colors.blue};  
    border-width: 1px;
    margin-right: 22px;

`;

export const ButtonLabel = styled.Text<{ reject?: boolean }>`
    color: ${(props) => (props.reject ? colors.gray8 : colors.gray8)};
    font-size: 12px;
`;
