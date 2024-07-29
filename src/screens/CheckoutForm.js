import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import URLS from '../constants/confix';
import Geolocation from '@react-native-community/geolocation';
import {AuthContext} from '../contexts/AuthContext';

const CheckoutForm = ({route, navigation}) => {
  const vehicleRef = useRef(null);
  const [plate, setPlate] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [valueParkingLot, setValueParkingLot] = useState(null);
  const [isFocusParkingLot, setIsFocusParkingLot] = useState(false);
  const [dataParkingLot, setDataParkingLot] = useState([]);
  const [valueVehicleType, setValueVehicleType] = useState(null);
  const [isFocusVehicleType, setIsFocusVehicleType] = useState(false);
  const [dataVehicleType, setDataVehicleType] = useState([]);
  const current_date = moment().format('YYYY-MM-DD');
  const current_time = moment().format('HH:mm:ss');
  const current_time_more_4h_str = moment().add(4, 'hours').format('HH:mm:ss');
  const current_time_more_4h = moment().add(4, 'hours').unix() * 1000;

  const current_date_unix = moment().valueOf();
  const [fromdate, setFromDate] = useState(new Date(current_date_unix));
  const [modeFromDate, setModeFromDate] = useState('date');
  const [showFromDate, setShowFromDate] = useState(false);
  const [todate, setToDate] = useState(new Date(current_date_unix));
  const [modeToDate, setModeToDate] = useState('date');
  const [showToDate, setShowToDate] = useState(false);

  const [currentDate, setCurrentDate] = useState(current_date);
  const [currentDate1WeekAway, setCurrentDate1WeekAway] =
    useState(current_date);

  const [fromtime, setFromTime] = useState(new Date(current_date_unix));
  const [modeFromTime, setModeFromTime] = useState('time');
  const [showFromTime, setShowFromTime] = useState(false);
  const [fromtime_string, setFromTime_string] = useState(current_time);
  const [totime_string, setToTime_string] = useState(current_time_more_4h_str);
  const [totime, setToTime] = useState(new Date(current_time_more_4h));
  const [modeToTime, setModeToTime] = useState('time');
  const [showToTime, setShowToTime] = useState(false);
  const [position, setPosition] = useState([]);

  const [dataVehicle, setDataVehicle] = useState([]);
  const [isFocusVehicle, setIsFocusVehicle] = useState(false);
  const [valueVehicle, setValueVehicle] = useState();
  const [valueVehicleLabel, setValueVehicleLabel] = useState('');
  const [valueParkingLotLabel, setValueParkingLotLabel] = useState('');
  const [token, setToken] = useState('');
  const [phone, setPhone] = useState('');

  const {signOut} = useContext(AuthContext);

  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem('token');
    const phone = await AsyncStorage.getItem('phone');
    setToken(token);
    setPhone(phone);
  };

  const getlatestparkingnotpaid = async plate => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const bodyParameters = {
      plate: plate,
    };
    axios
      .post(URLS.latestparkingnotpaid, bodyParameters, headers, {
        timeout: 5000,
      })
      .then(response => {
        if (response.data.data[0].luotxe_tien > 0) {
          setAmount(response.data.data[0].luotxe_tien.toString());
        }
      })
      .catch(error => {
        console.log('error get latest not paid: ' + error);
      });
  };

  const getVehicleTypeByPlate = async plate => {
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
    };
    axios
      .post(URLS.getvehicletypebyplate, bodyParameters, headers, {
        timeout: 5000,
      })
      .then(response => {
        if (response.data.data[0].type > 0) {
          setValueVehicleType(parseInt(response.data.data[0].type, 10));
        }
      })
      .catch(error => {
        console.log('error: ' + JSON.stringify(error.request));
      });
  };

  const getVehicles = async () => {
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
    };
    setIsLoading(true);
    axios
      .post(URLS.getvehicles, bodyParameters, headers, {timeout: 5000})
      .then(response => {
        //console.log(response.data.data[0].id);
        setDataVehicle(response.data.data);
        setValueVehicle(response.data.data[0].id);
        setValueVehicleLabel(response.data.data[0].plate);
        getVehicleTypeByPlate(response.data.data[0].plate);

        if (route.params) {
          if (route.params.sum_amount > 0) {
            const note =
              'Thanh toán phí đỗ xe. Biển số ' +
              response.data.data[0].plate +
              '. Số tiền: ' +
              route.params.sum_amount.toString() +
              ' VNĐ';
            setAmount(route.params.sum_amount.toString());
            setNote(note);
          }
        } else {
          getlatestparkingnotpaid(response.data.data[0].plate);
        }

        setIsLoading(false);
      })
      .catch(error => {
        console.log('error get vehicle: ' + error);
        setIsLoading(false);
      });
  };

  const onChangeFromDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowFromDate(false);
    setFromDate(currentDate);
    setCurrentDate1WeekAway(
      moment(currentDate).format('YYYY-MM-DD').toString(),
    );
  };
  const showModeFromDate = currentMode => {
    setShowFromDate(true);
    setModeFromDate(currentMode);
  };
  const showFromDatepicker = () => {
    showModeFromDate('date');
  };

  const onChangeFromTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowFromTime(false);
    setFromTime(currentDate);
    setFromTime_string(moment(currentDate).format('HH:mm:ss').toString());
  };
  const showModeFromTime = currentMode => {
    setShowFromTime(true);
    setModeFromTime(currentMode);
  };
  const showFromTimepicker = () => {
    showModeFromTime('time');
  };

  const onChangeToTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowToTime(false);
    setToTime(currentDate);
    setToTime_string(moment(currentDate).format('HH:mm:ss').toString());
  };
  const showModeToTime = currentMode => {
    setShowToTime(true);
    setModeToTime(currentMode);
  };
  const showToTimepicker = () => {
    showModeToTime('time');
  };

  const onChangeToDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowToDate(false);
    setToDate(currentDate);
    setCurrentDate(moment(currentDate).format('YYYY-MM-DD').toString());
  };
  const showModeToDate = currentMode => {
    setShowToDate(true);
    setModeToDate(currentMode);
  };
  const showToDatepicker = () => {
    showModeToDate('date');
  };

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

  const getParkingLot = async () => {
    axios
      .get(URLS.getparkinglot, {timeout: 5000})
      .then(response => {
        setDataParkingLot(response.data.data);
        setValueParkingLotLabel(response.data.data[0].baixe_ten);
      })
      .catch(error => {
        console.log('error get parking lot: ' + error);
        Alert.alert('Có lỗi khi lấy dữ liệu bãi đỗ xe ');
      });
  };
  const getCurrentPosition = async () => {
    //console.log('getCurrentPosition');
    Geolocation.getCurrentPosition(
      pos => {
        setPosition(pos.coords);
      },
      error => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      {enableHighAccuracy: true},
    );
  };

  const calcFee = () => {
    //console.log('vehicle: ' + valueVehicleLabel);
    var note =
      'Thanh toán phí đỗ xe, biển số ' +
      valueVehicleLabel +
      ', thời gian ' +
      moment(fromdate).format('YYYY-MM-DD').toString() +
      ' ' +
      moment(fromtime).format('HH:mm:ss').toString() +
      ', bãi xe ' +
      valueParkingLotLabel +
      ', số tiền ';
    setIsLoading(true);
    axios
      .post(
        URLS.calcfee,
        {
          plate: plate,
          parking_lot: valueParkingLot,
          vehicle_type: valueVehicleType,
          fromtime:
            moment(fromdate).format('YYYY-MM-DD').toString() +
            ' ' +
            moment(fromtime).format('HH:mm:ss').toString(),
          totime:
            moment(todate).format('YYYY-MM-DD').toString() +
            ' ' +
            moment(totime).format('HH:mm:ss').toString(),
        },
        {timeout: 5000},
      )
      .then(response => {
        if (response.data.data.length > 0) {
          setIsLoading(false);
          setAmount(response.data.data[0].fee.toString());
          note = note + response.data.data[0].fee.toString() + ' VNĐ';
          setNote(note);
        } else {
          setIsLoading(false);
          setAmount('');
          Alert.alert('Bạn chưa nhập đủ thông tin');
        }
      })
      .catch(error => {
        console.log('error calc fee: ' + error, isLoading);
        setIsLoading(false);
        Alert.alert('Có lỗi khi tính phí: ');
      });
  };

  const getPlateStoreAndVehicleStore = async () => {
    //console.log('getPlateStoreAndVehicleStore');
    try {
      axios
        .post(URLS.getnearestparkinglot, {
          timeout: 5000,
          lat: position.latitude,
          lng: position.longitude,
        })
        .then(response => {
          setValueParkingLot(parseInt(response.data.data.baixe_id));
        })
        .catch(error => {
          console.log('error get nearest parking lot: ' + error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getUserInfo();
      getPlateStoreAndVehicleStore();
      getParkingLot();
      getVehicleType();
      //getSumAmount();
      getVehicles();

      //getVehicleTypeByPlate(valueVehicle);
      //getCurrentPosition();
      //calcFee();
    }, []),
  );
  useEffect(() => {
    getCurrentPosition();
  }, []);
  /*useEffect(() => {
    console.log('callfee');
    calcFee();
  }, [amount]);*/

  return (
    <ScrollView>
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
              Biển số
            </Text>
            <View>
              {token ? (
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocusVehicle && {borderColor: 'blue'},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={dataVehicle}
                  search
                  maxHeight={300}
                  labelField="plate"
                  valueField="id"
                  placeholder={!isFocusVehicle ? 'Chọn phương tiện' : '...'}
                  searchPlaceholder="Tìm kiếm"
                  value={valueVehicle}
                  onFocus={() => setIsFocusVehicle(true)}
                  onBlur={() => setIsFocusVehicle(false)}
                  onChange={item => {
                    console.log('change');
                    setValueVehicle(item.id);
                    setValueVehicleLabel(item.plate);
                    setIsFocusParkingLot(false);
                  }}
                />
              ) : (
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
                    placeholder="Nhập thông tin"
                    placeholderTextColor={COLORS.black}
                    style={{
                      width: '100%',
                    }}
                    value={amount}
                    onChangeText={text => setAmount(text)}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={{marginBottom: 4}}>
            <View style={{marginBottom: 4}}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  marginVertical: 8,
                  color: COLORS.black,
                }}>
                Bãi giữ xe
              </Text>
              <View>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocusParkingLot && {borderColor: 'blue'},
                  ]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={dataParkingLot}
                  search
                  maxHeight={300}
                  labelField="baixe_ten"
                  valueField="baixe_id"
                  placeholder={!isFocusParkingLot ? 'Chọn bãi giữ xe' : '...'}
                  searchPlaceholder="Tìm kiếm"
                  value={valueParkingLot}
                  onFocus={() => setIsFocusParkingLot(true)}
                  onBlur={() => setIsFocusParkingLot(false)}
                  onChange={item => {
                    setValueParkingLot(item.baixe_id);
                    setIsFocusParkingLot(false);
                    setValueParkingLotLabel(item.name);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={{marginBottom: 4}}>
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
            </View>
          </View>
          <View style={{marginBottom: 4}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '40%'}}>
                <TouchableOpacity onPress={showFromDatepicker}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.black,
                    }}>
                    Từ ngày:{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      {currentDate1WeekAway ? (
                        <Text
                          style={{
                            paddingTop: 5,
                            borderBottomWidth: 1,
                            color: COLORS.black,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          {currentDate1WeekAway}
                        </Text>
                      ) : null}
                    </View>
                    <View>
                      <MaterialIcons
                        name="calendar-today"
                        size={32}
                        style={{textAlign: 'right'}}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{width: '40%'}}>
                <TouchableOpacity onPress={showToDatepicker}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.black,
                    }}>
                    Đến ngày:{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      {currentDate ? (
                        <Text
                          style={{
                            paddingTop: 5,
                            borderBottomWidth: 1,
                            color: COLORS.black,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          {currentDate}
                        </Text>
                      ) : null}
                    </View>
                    <View>
                      <MaterialIcons
                        name="calendar-today"
                        size={32}
                        style={{textAlign: 'right'}}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{marginBottom: 4}}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{width: '40%'}}>
                <TouchableOpacity onPress={showFromTimepicker}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.black,
                    }}>
                    Từ giờ:{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <View>
                      {fromtime_string ? (
                        <Text
                          style={{
                            paddingTop: 5,
                            borderBottomWidth: 1,
                            color: COLORS.black,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          {fromtime_string}
                        </Text>
                      ) : null}
                    </View>
                    <View>
                      <Octicons
                        name="clock"
                        size={32}
                        style={{textAlign: 'right'}}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{width: '40%'}}>
                <TouchableOpacity onPress={showToTimepicker}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.black,
                    }}>
                    Đến giờ:{' '}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    {totime_string ? (
                      <Text
                        style={{
                          paddingTop: 5,
                          borderBottomWidth: 1,
                          color: COLORS.black,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        {totime_string}
                      </Text>
                    ) : null}
                    <View>
                      <Octicons
                        name="clock"
                        size={32}
                        style={{textAlign: 'right'}}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{marginBottom: 4}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
                color: COLORS.black,
              }}>
              Số tiền
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
                placeholder="Nhập số tiền"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                keyboardType="numeric"
                value={amount}
                onChangeText={text => setAmount(text)}
              />
            </View>
          </View>
          <View style={{marginBottom: 4}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 400,
                marginVertical: 8,
                color: COLORS.black,
              }}>
              Nội dung
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
                placeholder="Nhập thông tin"
                placeholderTextColor={COLORS.black}
                style={{
                  width: '100%',
                }}
                value={note}
                onChangeText={text => setNote(text)}
              />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Button
                title="Thanh toán"
                filled
                onPress={() => {
                  //console.log(note);
                  navigation.navigate('CheckoutProcess', {
                    valueVehicleLabel,
                    amount,
                    note,
                  });
                }}
                style={{
                  marginTop: 18,
                  marginBottom: 4,
                }}
              />
            </View>
            <View>
              <Button
                title="Tính phí"
                filled
                onPress={() => {
                  calcFee();
                }}
                style={{
                  marginTop: 18,
                  marginBottom: 4,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              textAlign: 'stretch',
              flexWrap: 'wrap',
            }}>
            <TouchableOpacity onPress={() => signOut()}>
              <Text style={{color: 'blue', fontSize: 16}}>Đăng xuất ?</Text>
            </TouchableOpacity>
          </View>
          {showFromDate && (
            <DateTimePicker
              testID="dateTimePickerFrom"
              value={fromdate}
              mode={modeFromDate}
              is24Hour={true}
              onChange={onChangeFromDate}
            />
          )}
          {showToDate && (
            <DateTimePicker
              testID="dateTimePickerTo"
              value={todate}
              mode={modeToDate}
              is24Hour={true}
              onChange={onChangeToDate}
            />
          )}
          {showFromTime && (
            <DateTimePicker
              testID="dateTimePickerFromTime"
              value={fromtime}
              mode={modeFromTime}
              is24Hour={true}
              onChange={onChangeFromTime}
            />
          )}
          {showToTime && (
            <DateTimePicker
              testID="dateTimePickerToTime"
              value={totime}
              mode={modeToTime}
              is24Hour={true}
              onChange={onChangeToTime}
            />
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CheckoutForm;

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: COLORS.white,
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
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
