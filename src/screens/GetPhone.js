/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLORS from '../constants/colors';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import axios from 'axios';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import URLS from '../constants/confix';

const GetPhone = ({navigation}) => {
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState('');

  const sentPhone = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    if (phone === '' || phone === null) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Số điện thoại không được bỏ trống',
      });
      setIsLoading(false);
      return;
    }
    if (isNaN(phone)) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Số điện thoại không đúng định dạng',
      });
      setIsLoading(false);
      return;
    }
    axios
      .post(URLS.insertphone, {
        phone: phone,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      .then(response => {
        if (response.data.status) {
          /*Toast.show({
            type: 'success',
            text1: 'Thông báo',
            text2: `Mã xác nhận đã gửi đến số điện thoại ${phone}, vui lòng kiểm tra tin nhắn để xác nhận`,
          });*/
          navigation.navigate('Passotp', {
            phone: phone,
          });
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Thông báo',
          text2: 'Có lỗi xảy ra',
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    /*RNOtpVerify.getHash().then(console.log).catch(console.log);
    RNOtpVerify.getOtp()
      .then(p => RNOtpVerify.addListener(otpHandler))
      .catch(p => console.log(p));*/
  });

  /*const otpHandler = message => {
    const otp = /(\d{4})/g.exec(message[1]);
    setOtp(otp);
    RNOtpVerify.removeListener();
    //Keyboard.dismiss();
  };*/

  const onChangePhoneHandler = phone => {
    setPhone(phone);
  };

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        {isLoading ? (
          <View style={styles.loaderStyle}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : null}
        <View style={{flex: 1, marginHorizontal: 22}}>
          <View style={{marginBottom: 12, marginTop: 12}}>
            <View
              style={{
                width: '100%',
                height: 48,
                borderColor: COLORS.black,
                borderWidth: 1,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: 22,
              }}>
              <TextInput
                placeholder="Số điện thoại"
                keyboardType="numeric"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                onChangeText={onChangePhoneHandler}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', marginVertical: 6}}>
            <CheckBox
              style={{marginRight: 8}}
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? COLORS.primary : undefined}
            />
            <Text style={{marginTop: 5, fontSize: 16, color: COLORS.black}}>
              Tôi đồng ý với các điều khoản và điều kiện
            </Text>
          </View>
          <Button
            disabled={!isChecked}
            title="Đăng kí"
            onPress={() => {
              sentPhone();
            }}
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
          <Text>{otp}</Text>
        </View>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default GetPhone;

const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
