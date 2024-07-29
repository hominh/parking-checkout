import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import COLORS from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlashList} from '@shopify/flash-list';
import axios from 'axios';
import Button from '../components/Button';
import URLS from '../constants/confix';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';

const Vehicle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataVehicleType, setDataVehicleType] = useState([]);
  const [isFocusVehicleType, setIsFocusVehicleType] = useState(false);
  const [valueVehicleType, setValueVehicleType] = useState(1);
  const [plate, setPlate] = useState('');

  const getVehicleType = async () => {
    axios
      .get(URLS.getvehicletype, {timeout: 5000})
      .then(response => {
        setDataVehicleType(response.data.data);
      })
      .catch(error => {
        console.log('error get vehicletype: ' + error);
      });
  };

  const getVehicles = async () => {
    const phone = await AsyncStorage.getItem('phone');
    const token = await AsyncStorage.getItem('token');
    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token.toString()}`,
      },
    };
    const bodyParameters = {
      phone: phone,
    };
    setIsLoading(true);
    axios
      .post(URLS.getvehicles, bodyParameters, headers)
      .then(response => {
        setVehicles(response.data.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('error: ' + JSON.stringify(error.request));
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getVehicles();
    getVehicleType();
  }, []);
  const renderItem = useCallback(
    ({item}) => (
      <View key={item.id} style={styles.viewPlate}>
        <Text>{item.plate}</Text>
      </View>
    ),
    [],
  );
  const showModalAddvehicle = () => {
    setModalVisible(true);
    getVehicleType();
  };
  const addVehicle = async () => {
    setIsLoading(true);
    if (valueVehicleType == 0) {
      Alert.alert('Bạn chưa chọn loại xe');
      return;
    }
    const phone = await AsyncStorage.getItem('phone');
    const token = await AsyncStorage.getItem('token');
    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const bodyParameters = {
      phone: phone,
      plate: plate,
      type: valueVehicleType,
    };
    axios
      .post(URLS.insertvehicle, bodyParameters, headers)
      .then(response => {
        if (response.data.status) {
          Toast.show({
            type: 'success',
            text1: 'Thông báo',
            text2: 'Thêm phương tiện thành công',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Thông báo',
            text2: 'Thêm phương tiện thất bại',
          });
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log('error: ' + JSON.stringify(error.request));
        setIsLoading(false);
      });
    setModalVisible(false);
    setVehicles([]);
    getVehicles();
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
          <View style={{marginBottom: 4}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
                color: COLORS.black,
              }}>
              Chọn phương tiện
            </Text>
          </View>
          {vehicles.length > 0 ? (
            <View>
              <FlashList
                data={vehicles}
                renderItem={renderItem}
                estimatedItemSize={200}
                horizontal={true}
              />
            </View>
          ) : null}
          <Button
            disabled={false}
            title="Thêm biển số"
            filled
            onPress={() => {
              showModalAddvehicle();
            }}
            style={{
              marginTop: 18,
              marginBottom: 4,
            }}
          />
        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View>
                  <Text style={styles.modalText}>THÊM BIỂN SỐ XE</Text>
                </View>
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
                    placeholder="Biển số"
                    placeholderTextColor={COLORS.black}
                    style={{
                      width: '100%',
                    }}
                    value={plate}
                    onChangeText={text => setPlate(text)}
                  />
                </View>
                <View style={{alignItems: 'flex-start', marginTop: 5}}>
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
                    labelField="loaixe_ten"
                    valueField="loaixe_id"
                    placeholder={!isFocusVehicleType ? 'Chọn loại xe' : '...'}
                    searchPlaceholder="Tìm kiếm"
                    value={valueVehicleType}
                    onFocus={() => setIsFocusVehicleType(true)}
                    onBlur={() => setIsFocusVehicleType(false)}
                    onChange={item => {
                      setValueVehicleType(item.loaixe_id);
                      setIsFocusVehicleType(false);
                    }}
                  />
                </View>
                <View>
                  <Button
                    disabled={false}
                    title="THÊM PHƯƠNG TIỆN"
                    onPress={() => {
                      addVehicle();
                    }}
                    filled
                    style={{
                      marginTop: 18,
                      marginBottom: 4,
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
      <Toast />
    </>
  );
};

export default Vehicle;

const styles = StyleSheet.create({
  viewPlate: {
    paddingLeft: 10,
    paddingRight: 10,
    borderWidth: 1,
    borderRadius: 6,
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    marginRight: 20,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.black,
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: COLORS.black,
    width: '100%',
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
