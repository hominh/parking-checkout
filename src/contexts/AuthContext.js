import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import URLS from '../constants/confix';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const register = (name, email, password, phone) => {
    setIsLoadingAuth(true);
    axios
      .post(URLS.signup, {
        name,
        email,
        password,
        phone,
        device_name: `${Platform.OS} ${Platform.Version}`,
      })
      .then(response => {
        let userInfo = response.data;
        AsyncStorage.setItem('token', userInfo.token);
        AsyncStorage.setItem('phone', phone);
        setUserInfo(userInfo);
        setIsLoadingAuth(false);
      })
      .catch(error => {
        console.log('error: ' + error);
        setIsLoadingAuth(false);
      });
  };

  const login = (phone, password) => {
    setIsLoadingAuth(true);
    axios
      .post(URLS.signin, {
        phone,
        password,
        device_name: `${Platform.OS} ${Platform.Version}`,
      })
      .then(response => {
        let userInfo = response.data;
        const p = response.data.user.phone;
        AsyncStorage.setItem('token', userInfo.token);
        AsyncStorage.setItem('phone', p);
        setUserInfo(userInfo);
        setIsLoadingAuth(false);
      })
      .catch(error => {
        console.log('error login: ' + error + phone + password);
        setIsLoadingAuth(false);
        Alert.alert('Có lỗi khi đăng nhập');
      });
  };

  const isLoggedIn = async () => {
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);
      if (userInfo) {
        setUserInfo(userInfo);
      }
    } catch (e) {
      console.log(`is logged in error ${e}`);
    }
  };
  const signOut = async () => {
    setIsLoadingAuth(true);
    axios
      .post(
        URLS.signout,
        {},
        {
          headers: {
            Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
            Accept: 'application/json',
          },
        },
      )
      .then(response => {
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('phone');
        setUserInfo({});
        setIsLoadingAuth(false);
      })
      .catch(error => {
        console.log('error signout: ' + error);
        setIsLoadingAuth(false);
      });
  };
  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoadingAuth,
        userInfo,
        register,
        login,
        isLoggedIn,
        signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
