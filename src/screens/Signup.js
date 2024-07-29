import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import COLORS from '../constants/colors';
import React, {useContext, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import {AuthContext} from '../contexts/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';

const Signup = props => {
  //console.log(props.route.params.phone);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const {isLoading, register} = useContext(AuthContext);

  const onChangeEmailHandler = email => {
    setEmail(email);
  };
  const onChangeNameHandler = name => {
    setName(name);
  };

  const onChangePasswordlHandler = password => {
    setPassword(password);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1, marginHorizontal: 22}}>
        <Spinner visible={isLoading} />
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
            }}>
            Tên
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
              placeholder="Nhập tên"
              placeholderTextColor={COLORS.black}
              style={{
                width: '100%',
              }}
              onChangeText={onChangeNameHandler}
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
            Địa chỉ email
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
              placeholder="Nhập địa chỉ email"
              placeholderTextColor={COLORS.black}
              keyboardType="email-address"
              style={{
                width: '100%',
              }}
              onChangeText={onChangeEmailHandler}
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
          title="Đăng kí"
          onPress={() => {
            register(name, email, password, props.route.params.phone);
          }}
          filled
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({});
