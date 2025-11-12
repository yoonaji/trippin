import React from 'react';
import { Image, Text, View } from 'react-native';
import { colors } from '../../styles/colors';
import CustomText from './CustomText';
import toast_success from '../../assets/images/icon/toast_success.png';

const CustomSuccessToast = ({ text1, text2 }: any) => (
  <View
    style={{
      width: '90%',
      backgroundColor: '#EFF6FC',
      padding: 16,
      borderRadius: 10,
      marginHorizontal: 20,
      marginBottom: 90,
    }}
  >
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
      <Image source={toast_success} style={{ width: 32, height: 32 }} />
      <View style={{ flexDirection: 'column' }}>
        <CustomText style={{ color: colors.gray8, fontSize: 16 }} weight="600">
          {text1}
        </CustomText>
        {text2 && (
          <CustomText style={{ color: colors.gray8, fontSize: 13 }}>
            {text2}
          </CustomText>
        )}
      </View>
    </View>
  </View>
);

export default CustomSuccessToast;
