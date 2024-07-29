import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import COLORS from '../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Button from '../components/Button';
import {useNavigation} from '@react-navigation/native';
import URLS from '../constants/confix';

const HistoryParking = () => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataParkingItem, setDataParkingItem] = useState(null);

  var current_date_1week_away_unix = moment().subtract(7, 'days').unix() * 1000;
  var current_date_1week_away = moment()
    .subtract(7, 'days')
    .format('YYYY-MM-DD');

  var current_date = moment().format('YYYY-MM-DD');

  var current_date_unix = moment().valueOf();

  const [fromdate, setFromDate] = useState(
    new Date(current_date_1week_away_unix),
  );
  const [modeFromDate, setModeFromDate] = useState('date');
  const [showFromDate, setShowFromDate] = useState(false);

  const [todate, setToDate] = useState(new Date(current_date_unix));
  const [modeToDate, setModeToDate] = useState('date');
  const [showToDate, setShowToDate] = useState(false);

  const [currentDate, setCurrentDate] = useState(current_date);
  const [currentDate1WeekAway, setCurrentDate1WeekAway] = useState(
    current_date_1week_away,
  );
  const [sum_amount, setSumAmount] = useState(0);
  const onChangeFromDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowFromDate(false);
    setFromDate(currentDate);
    setCurrentDate1WeekAway(
      moment(currentDate).format('YYYY-MM-DD').toString(),
    );
    setData([]);
    setPage(1);
  };
  const showModeFromDate = currentMode => {
    setShowFromDate(true);
    setModeFromDate(currentMode);
  };
  const showFromDatepicker = () => {
    showModeFromDate('date');
  };

  const onChangeToDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowToDate(false);
    setToDate(currentDate);
    setCurrentDate(moment(currentDate).format('YYYY-MM-DD').toString());
    setData([]);
    setPage(1);
  };
  const showModeToDate = currentMode => {
    setShowToDate(true);
    setModeToDate(currentMode);
  };
  const showToDatepicker = () => {
    showModeToDate('date');
  };

  const getHistoryCheckout = async () => {
    const plate = await getPlateStore();
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
      page: page,
      fromdate: moment(fromdate).format('YYYY-MM-DD').toString() + ' 00:00:00',
      todate: moment(todate).format('YYYY-MM-DD').toString() + ' 23:59:59',
    };
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    axios
      .post(URLS.gethistory, bodyParameters, headers, {timeout: 1000 * 30})
      .then(response => {
        if (response.data.data.data.length > 0) {
          //console.log(response.data.data.data);
          setData([...data, ...response.data.data.data]);
          setPage(page + 1);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log('error get history checkout: ' + error, isLoading, plate);
        setIsLoading(false);
        Alert.alert('Có lỗi khi tra cứu lịch sử');
      });
  };

  const getSumFeeNotPaid = async () => {
    const token = await AsyncStorage.getItem('token');
    const phone = await AsyncStorage.getItem('phone');
    const headers = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const bodyParameters = {
      phone: phone,
      fromdate: moment(fromdate).format('YYYY-MM-DD').toString() + ' 00:00:00',
      todate: moment(todate).format('YYYY-MM-DD').toString() + ' 23:59:59',
    };
    axios
      .post(URLS.getsumamountnotpaid, bodyParameters, headers, {
        timeout: 1000 * 30,
      })
      .then(response => {
        setSumAmount(response.data.data[0].fee_not_paid);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('error get sum amount not paid: ' + error);
        setIsLoading(false);
       // Alert.alert('Có lỗi khi tra cứu lịch sử');
      });
  };

  const getPlateStore = async () => {
    try {
      const p = await AsyncStorage.getItem('plate');
      return p;
    } catch (error) {
      console.log(error);
    }
  };

  const checkOut = () => {
    Alert.alert(
      'Thông báo',
      'Bạn có muốn thanh toán những lượt đỗ xe chưa thanh toán',
      [
        {
          text: 'Có',
          onPress: () =>
            navigation.navigate('CheckoutStackScreen', {
              sum_amount: sum_amount,
            }),
        },
        {text: 'Không', onPress: () => console.log('OK Pressed')},
      ],
      {cancelable: false},
    );
  };

  const renderLoader = () => {
    return (
      <View style={styles.loaderStyle}>
        {isLoading ? (
          <View style={styles.loaderStyle}>
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : null}
      </View>
    );
  };

  const onEndReached = useCallback(() => {
    getHistoryCheckout();
  });
  const keyExtractor = useCallback(
    (item: any, i: number) => `${i}-${item.id}`,
    [],
  );

  /*const getParkingItem = async item => {

    console.log(dataParkingItem);
    setModalVisible(true);
  };*/

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => {
          setDataParkingItem(item);
          console.log(item.luotxe_bienso);
          setModalVisible(true);
          console.log(dataParkingItem);
        }}>
        <View style={styles.itemWrapperStyle}>
          <View style={styles.contentWrapperStyle}>
            <Text style={styles.txtNameStyle}>
              Biển số :{item.luotxe_bienso}. Bãi đỗ: {item.baixe_ten}
            </Text>
            <Text style={styles.txtNameStyle}>
              Thời gian :{item.luotxe_thoigianbatdau}
            </Text>
            <Text style={styles.txtNameStyle}>
              Thời gian dừng đỗ :{item.luotxe_thoigian} giây. Số tiền:{' '}
              {item.luotxe_tien} VNĐ
            </Text>
            {item.luotxe_trangthaithanhtoan === 1 ? (
              <Text style={styles.txtEmailStyle}>
                Trạng thái: thanh toán thành công
              </Text>
            ) : (
              <Text style={styles.txtEmailStyle}>
                Trạng thái: thanh toán thất bại
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  useEffect(() => {
    //getUsers();
    getHistoryCheckout();
    getSumFeeNotPaid();
    //getCurrentDate();
    //getCurrentDate();
    //onChangeFromDate();
  }, [
    fromdate,
    todate,
    page,
    currentDate1WeekAway,
    currentDate,
    dataParkingItem,
  ]);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <View style={{flex: 1, marginHorizontal: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '30%'}}>
              <TouchableOpacity onPress={showFromDatepicker}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                  }}>
                  Từ:{' '}
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
            <View style={{width: '30%'}}>
              <TouchableOpacity onPress={showToDatepicker}>
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.black,
                  }}>
                  Đến:{' '}
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
            <View style={{width: '30%'}}>
              <Button
                title="Thanh toán"
                filled
                onPress={() => {
                  checkOut();
                }}
                style={{
                  marginTop: 18,
                  marginBottom: 4,
                }}
              />
            </View>
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
          <FlashList
            removeClippedSubviews
            initialNumToRender={5}
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={renderLoader}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.7}
            estimatedItemSize={200}
          />
        </View>
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
                <Text style={styles.modalText}>CHI TIẾT LƯỢT ĐÔ XE</Text>
              </View>
              <View>
                {dataParkingItem ? (
                  <>
                    <Text style={styles.modalTextBody}>
                      Biển số: {dataParkingItem.luotxe_bienso}
                    </Text>
                    <Text style={styles.modalTextBody}>
                      Thời gian bắt đầu: {dataParkingItem.luotxe_thoigianbatdau}
                    </Text>
                    <Text style={styles.modalTextBody}>
                      Thời gian kết thúc:{' '}
                      {dataParkingItem.luotxe_thoigianketthuc}
                    </Text>
                    <Text style={styles.modalTextBody}>
                      Bãi đỗ: {dataParkingItem.baixe_ten}
                    </Text>
                    <Text style={styles.modalTextBody}>
                      Số tiền: {dataParkingItem.luotxe_tien} VNĐ
                    </Text>
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri:
                          'https://vts.clii.vn/sanpham/carparking' +
                          dataParkingItem.luotxe_imgurl1,
                      }}
                    />
                    <Image
                      style={styles.tinyLogo}
                      source={{
                        uri:
                          'https://vts.clii.vn/sanpham/carparking' +
                          dataParkingItem.luotxe_imgurl2,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        console.log('close');
                      }}>
                      <Button
                        disabled={false}
                        title="Đóng"
                        onPress={() => {
                          setModalVisible(false);
                        }}
                        filled
                        style={{
                          marginTop: 5,
                          marginBottom: 4,
                        }}
                      />
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default HistoryParking;

const styles = StyleSheet.create({
  itemWrapperStyle: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemImageStyle: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  contentWrapperStyle: {
    justifyContent: 'space-around',
  },
  txtNameStyle: {
    fontSize: 16,
    color: COLORS.black,
  },
  txtEmailStyle: {
    fontSize: 16,
    color: COLORS.black,
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
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.black,
  },
  modalTextBody: {
    color: COLORS.black,
  },
  tinyLogo: {
    marginTop: 5,
    width: '100%',
    height: 200,
  },
});
