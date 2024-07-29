import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import URLS from '../constants/confix';

const PlateStore = ({navigation}) => {
  const [plate, setPlate] = useState('');
  const [valueVehicleType, setValueVehicleType] = useState(null);
  const [isFocusVehicleType, setIsFocusVehicleType] = useState(false);
  const [dataVehicleType, setDataVehicleType] = useState([]);
  const getVehicleType = async () => {
    axios
      .get(URLS.getvehicletype, {timeout: 5000})
      .then(response => {
        setDataVehicleType(response.data.data);
      })
      .catch(error => {
        console.log('error get vehicletype: ' + error);
        Alert.alert('Có lỗi khi lấy dữ liệu loại xe ');
      });
  };
  const updatePlate = async () => {
    await AsyncStorage.setItem('plate', plate);
    await AsyncStorage.setItem('vehicleType', valueVehicleType.toString());
    const plateStore = await AsyncStorage.getItem('plate');
    const vehicleType = await AsyncStorage.getItem('vehicleType');
    if (plateStore && vehicleType) {
      Alert.alert('Cập nhật thông tin thành công');
      navigation.navigate('CheckoutStackScreen');
    } else {
      Alert.alert('Bạn phải nhập biển số xe và chọn loại xe');
    }
  };
  useEffect(() => {
    getVehicleType();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <View style={{flex: 1, marginHorizontal: 22}}>
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              color: COLORS.black,
            }}>
            Biển số
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
              value={plate}
              onChangeText={text => setPlate(text)}
              placeholder="Nhập biển số"
              placeholderTextColor={COLORS.black}
              style={{
                width: '100%',
              }}
            />
          </View>
        </View>
        <View style={{marginBottom: 12}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              marginVertical: 8,
              color: COLORS.black,
            }}>
            Loại xe
          </Text>
          <View>
            <Dropdown
              style={[
                styles.dropdown,
                isFocusVehicleType && {borderColor: 'blue'},
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={dataVehicleType}
              search
              maxHeight={300}
              labelField="loaixeTen"
              valueField="loaixeId"
              placeholder={!isFocusVehicleType ? 'Chọn loại xe' : '...'}
              searchPlaceholder="Tìm kiếm"
              value={valueVehicleType}
              onFocus={() => setIsFocusVehicleType(true)}
              onBlur={() => setIsFocusVehicleType(false)}
              onChange={item => {
                setValueVehicleType(item.loaixeId);
                setIsFocusVehicleType(false);
              }}
            />
          </View>
        </View>
        <Button
          title="Cập nhật"
          filled
          onPress={() => {
            updatePlate();
          }}
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlateStore;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: COLORS.black,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: COLORS.black,
  },
  placeholderStyle: {
    fontSize: 16,
    color: COLORS.black,
  },
  selectedTextStyle: {
    color: COLORS.black,
  },
});
