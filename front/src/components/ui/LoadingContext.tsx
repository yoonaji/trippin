import React, { createContext, useContext, useState } from 'react';
import { Modal } from 'react-native';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import CustomText from './CustomText';
import { colors } from '../../styles/colors';

type LoadingContextType = {
  setLoading: (visible: boolean, message?: string) => void;
  setLoadingPromise: <T>(promise: Promise<T>, message?: string) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextType>({
  setLoading: () => {},
  setLoadingPromise: async <T,>(p: Promise<T>) => p,
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('로딩 중...');

  const setLoading = (show: boolean, msg?: string) => {
    setVisible(show);
    if (msg) setMessage(msg);
  };

  const setLoadingPromise = async <T,>(
    promise: Promise<T>,
    msg?: string,
  ): Promise<T> => {
    try {
      setLoading(true, msg);
      const result = await promise;
      return result;
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ setLoading, setLoadingPromise }}>
      {children}

      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => {}}
      >
        <Overlay>
          <LottieView
            source={require('../../assets/animations/loading.json')}
            autoPlay
            loop
            style={{ width: 120, height: 120 }}
          />
          <Message>{message}</Message>
        </Overlay>
      </Modal>
    </LoadingContext.Provider>
  );
};

const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.25);
  justify-content: center;
  align-items: center;
`;

const Message = styled(CustomText)`
  color: ${colors.gray8};
  margin-top: 10px;
  font-weight: 700;
`;
