import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLORS from '../constants/colors';
import Toast from 'react-native-toast-message';
import Button from '../components/Button';
import axios from 'axios';
import moment from 'moment';
import URLS from '../constants/confix';

const Passotp = props => {
  //console.log(props.navigation);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const displayToast = () => {
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Thông báo',
      text2: `Mã xác nhận đã gửi đến số điện thoại ${props.route.params.phone}, vui lòng kiểm tra tin nhắn để xác nhận`,
    });
  };

  const onChangeOtpHandler = otp => {
    setOtp(otp);
  };

  const sentOtp = () => {
    Keyboard.dismiss();
    setIsLoading(true);
    const phone = props.route.params.phone;
    axios
      .post(URLS.verifyotp, {
        phone: phone.toString(),
        time: moment().format('YYYY-MM-DD HH:mm:ss').toString(),
        otp: otp.toString(),
      })
      .then(response => {
        console.log(response.data.data);
        if (response.data.data === 1) {
          props.navigation.navigate('Signup', {
            phone: props.route.params.phone,
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Thông báo',
            text2: 'Có lỗi xảy ra',
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
    displayToast();
  }, []);
  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <View style={{flex: 1, marginHorizontal: 22}}>
          <View style={{marginBottom: 12, marginTop: 12}}>
            <Text
              style={{fontWeight: 'bold', color: COLORS.black, fontSize: 16}}>
              Số điện thoại {props.route.params.phone}
            </Text>
          </View>
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
                placeholder="Mã xác nhận"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                onChangeText={onChangeOtpHandler}
              />
            </View>
          </View>
          <Button
            disabled={false}
            title="Kích hoạt"
            onPress={() => {
              sentOtp();
            }}
            filled
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
        </View>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Passotp;

const styles = StyleSheet.create({});
