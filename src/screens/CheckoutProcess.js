import {StyleSheet, SafeAreaView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import WebView from 'react-native-webview';
import COLORS from '../constants/colors';
import URLS from '../constants/confix';

const CheckoutProcess = props => {
  const [uri, setUri] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const getUri = () => {
    console.log(
      props.route.params.valueVehicleLabel,
      props.route.params.amount,
      props.route.params.note,
    );
    let note;
    if (!props.route.params.note) {
      note = 'Thanh toán phí đỗ xe';
    }
    axios
      .post(URLS.createpayment, {
        plate: props.route.params.valueVehicleLabel,
        amount: props.route.params.amount,
        note: note,
      })
      .then(response => {
        setUri(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('error set uri: ' + error);
        setIsLoading(false);
        Alert.alert('Có lỗi khi thanh toán');
      });
  };
  useEffect(() => {
    getUri();
  }, []); //CHeck is loading
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <WebView source={{uri: uri}} style={{flex: 1}} />
    </SafeAreaView>
  );
};

export default CheckoutProcess;

const styles = StyleSheet.create({});
