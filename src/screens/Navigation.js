/* eslint-disable react/no-unstable-nested-components */
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../contexts/AuthContext';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CheckoutForm from './CheckoutForm';
import CheckoutProcess from './CheckoutProcess';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HistoryCheckout from './HistoryCheckout';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HistoryParking from './HistoryParking';
import GetPhone from './GetPhone';
import Passotp from './Passotp';
import Signup from './Signup';
import Vehicle from './Vehicle';
import Signin from './Signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CheckoutStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}>
      <Stack.Screen
        name="CheckoutStackScreen"
        component={CheckoutForm}
        options={{title: 'Thanh toán', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="CheckoutProcess"
        component={CheckoutProcess}
        options={{title: 'Thanh toán'}}
      />
    </Stack.Navigator>
  );
};
const HistoryCheckoutStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryCheckoutStackScreen"
        component={HistoryCheckout}
        options={{title: 'Lịch sử thanh toán', unmountOnBlur: true}}
      />
    </Stack.Navigator>
  );
};

const SigninStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SigninStackScreen"
        component={Signin}
        options={{title: 'Đăng nhập', unmountOnBlur: true}}
      />
    </Stack.Navigator>
  );
};

const VehicleStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VehicleStackScreen"
        component={Vehicle}
        options={{title: 'Phương tiện', unmountOnBlur: true}}
      />
    </Stack.Navigator>
  );
};

const GetPhoneStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GetPhoneStackScreen"
        component={GetPhone}
        options={{title: 'Số điện thoại kích hoạt', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="Passotp"
        component={Passotp}
        options={{title: 'Kích hoạt tài khoản', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{title: 'Đăng kí', unmountOnBlur: true}}
      />
    </Stack.Navigator>
  );
};
const HistoryParkingStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HistoryParkingScreen"
        component={HistoryParking}
        options={{title: 'Lịch sử đỗ xe', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="CheckoutStackScreen"
        component={CheckoutForm}
        options={{title: 'Thanh toán', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="CheckoutProcess"
        component={CheckoutProcess}
        options={{title: 'Thanh toán'}}
      />
    </Stack.Navigator>
  );
};
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}>
      <Stack.Screen
        name="CheckoutStackScreen"
        component={CheckoutForm}
        options={{title: 'Thanh toán', unmountOnBlur: true}}
      />
      <Stack.Screen
        name="CheckoutProcess"
        component={CheckoutProcess}
        options={{title: 'Thanh toán'}}
      />
      <Stack.Screen
        name="GetPhone"
        component={GetPhone}
        options={{title: 'Xác thực otp'}}
      />
      <Stack.Screen
        name="Passotp"
        component={Passotp}
        options={{title: 'Xác thực otp'}}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{title: 'Đăng kí'}}
      />
    </Stack.Navigator>
  );
};
const App = () => {
  const {userInfo} = useContext(AuthContext);
  const [token, setToken] = useState('');
  const [phone, setPhone] = useState('');
  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem('token');
    const phone = await AsyncStorage.getItem('phone');
    setToken(token);
    setPhone(phone);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#E96E6E',
        }}>
        {!userInfo.token && token === null && phone === null ? (
          <>
            <Tab.Screen
              name="CheckoutTabScreen"
              component={CheckoutStack}
              options={{
                unmountOnBlur: true,
                title: 'Thanh toán',
                tabBarIcon: () => {
                  return <MaterialIcons name="payment" size={32} />;
                },
              }}
            />
            <Tab.Screen
              name="GetphoneTabScreen"
              component={GetPhoneStack}
              options={{
                unmountOnBlur: true,
                title: 'Đăng kí',
                tabBarIcon: () => {
                  return <MaterialIcons name="account-box" size={32} />;
                },
              }}
            />
            <Tab.Screen
              name="SiginTabScreen"
              component={SigninStack}
              options={{
                unmountOnBlur: true,
                title: 'Đăng nhập',
                tabBarIcon: () => {
                  return <MaterialIcons name="login" size={32} />;
                },
              }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name="CheckoutTabScreen"
              component={AuthStack}
              options={{
                unmountOnBlur: true,
                title: 'Thanh toán',
                tabBarIcon: () => {
                  return <MaterialIcons name="payment" size={32} />;
                },
              }}
            />
            <Tab.Screen
              name="HistoryCheckoutTabScreen"
              component={HistoryCheckoutStack}
              options={{
                unmountOnBlur: true,
                title: 'Lịch sử thanh toán',
                tabBarIcon: () => {
                  return <Octicons name="history" size={32} />;
                },
              }}
            />
            <Tab.Screen
              name="HistoryParkingTabScreen"
              component={HistoryParkingStack}
              options={{
                unmountOnBlur: true,
                title: 'Lịch sử đỗ xe',
                tabBarIcon: () => {
                  return <MaterialIcons name="work-history" size={32} />;
                },
              }}
            />
            <Tab.Screen
              name="VehicleTabScreen"
              component={VehicleStack}
              options={{
                unmountOnBlur: true,
                title: 'Phương tiện',
                tabBarIcon: () => {
                  return <FontAwesome5 name="car" size={32} />;
                },
              }}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};
export default App;
