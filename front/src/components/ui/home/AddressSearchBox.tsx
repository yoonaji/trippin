import { forwardRef, useImperativeHandle, useState } from 'react';
import { AnimatableStringValue, Modal, Pressable } from 'react-native';
import DaumPostcode from '@actbase/react-daum-postcode';
import styled from 'styled-components/native';
import CustomText from '../CustomText';
import { colors } from '../../../styles/colors';

export interface AddressSearchRef {
  open: () => void;
}

interface AddressSearchProps {
  onSelect: (
    mainAddress: string,
    buildingName: string,
    zonecode: string,
  ) => void;
}

const AddressSearchBox = forwardRef<AddressSearchRef, AddressSearchProps>(
  ({ onSelect }, ref) => {
    const [visible, setVisible] = useState(false);
    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
    }));

    const handleSelect = (data: any) => {
      const road = data.roadAddress || data.address;
      const building = data.buildingName || '';

      onSelect(road, building, data.zonecode);
      setVisible(false);
    };

    return (
      <>
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          onRequestClose={() => setVisible(false)}
        >
          <Overlay>
            <ModalContainer>
              <Header>
                <HeaderText weight="600">주소 검색</HeaderText>
              </Header>

              <PostcodeWrapper>
                <DaumPostcode
                  style={{ flex: 1 }}
                  onSelected={handleSelect}
                  onError={() => setVisible(false)}
                />
              </PostcodeWrapper>

              <CloseButton onPress={() => setVisible(false)}>
                <CloseButtonText>닫기</CloseButtonText>
              </CloseButton>
            </ModalContainer>
          </Overlay>
        </Modal>
      </>
    );
  },
);

export default AddressSearchBox;

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: flex-end;
`;

const ModalContainer = styled.View`
  height: 80%;
  background-color: ${colors.white};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
`;

const Header = styled.View`
  background-color: ${colors.white};
  padding-vertical: 15px;
  align-items: center;
`;

const HeaderText = styled(CustomText)`
  color: ${colors.gray7};
  font-size: 15px;
`;

const PostcodeWrapper = styled.View`
  flex: 1;
`;

const CloseButton = styled.Pressable`
  padding: 14px;
  align-items: center;
  background-color: ${colors.gray3};
`;

const CloseButtonText = styled(CustomText)`
  font-size: 13px;
  color: ${colors.gray8};
`;
