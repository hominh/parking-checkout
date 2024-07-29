/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useState} from 'react';
import COLORS from '../constants/colors';
import Feather from 'react-native-vector-icons/Feather';
import Button from '../components/Button';
import {AuthContext} from '../contexts/AuthContext';

const Signin = ({navigation}) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const {isLoadingAuth, login} = useContext(AuthContext);
  console.log(AuthContext);
  const onChangePhoneHandler = phone => {
    setPhone(phone);
  };

  const onChangePasswordlHandler = password => {
    setPassword(password);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1, marginHorizontal: 22}}>
        {isLoadingAuth ? (
          <View style={styles.loaderStyle}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : null}
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Số điện thoại
          </Text>
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
              placeholder="Nhập số điện thoại"
              placeholderTextColor={COLORS.black}
              keyboardType="numeric"
              style={{
                width: '100%',
              }}
              onChangeText={onChangePhoneHandler}
            />
          </View>
        </View>
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Mật khẩu
          </Text>
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
              placeholder="Nhập mật khẩu"
              placeholderTextColor={COLORS.black}
              secureTextEntry={!isPasswordShown}
              style={{
                width: '100%',
              }}
              onChangeText={onChangePasswordlHandler}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: 'absolute',
                right: 12,
              }}>
              {isPasswordShown === true ? (
                <Feather name={'eye-off'} size={24} color={COLORS.black} />
              ) : (
                <Feather name={'eye'} size={24} color={COLORS.black} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Button
          onPress={() => {
            login(phone, password);
          }}
          title="Đăng nhập"
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text style={{color: COLORS.black}}>Bạn chưa có tài khoản </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Parking')}>
            <Text style={{color: 'blue'}}>Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
