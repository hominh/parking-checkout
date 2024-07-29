import {
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import {FlashList} from '@shopify/flash-list';
import COLORS from '../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import URLS from '../constants/confix';

const HistoryCheckout = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

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

  const getCurrentDate = () => {
    /*var current_date = moment().format('YYYY-MM-DD');
    var current_date_1week_away = moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD');
    var current_date_1week_away_unix =
      moment().subtract(7, 'days').unix() * 1000;
    var current_date_unix = moment().valueOf();
    //setCurrentDate(current_date);*/
    var current_date_1week_away = moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD');
    setCurrentDate1WeekAway(current_date_1week_away);
    /*setFromDate(new Date(1598051730000));
    setToDate(new Date(1598051730000));*/
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
      .post(URLS.getorder, bodyParameters, headers, {timeout: 1000 * 30})
      .then(response => {
        if (response.data.data.data.length > 0) {
          setData([...data, ...response.data.data.data]);
          setPage(page + 1);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.log('error get history checkout: ' + error, isLoading, phone);
        setIsLoading(false);
        Alert.alert('Có lỗi khi tra cứu lịch sử');
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

  const renderItem = useCallback(
    ({item}) => (
      <View style={styles.itemWrapperStyle}>
        <View style={styles.contentWrapperStyle}>
          <Text style={styles.txtNameStyle}>Biển số :{item.plate}</Text>
          <Text style={styles.txtNameStyle}>Thời gian :{item.createdAt}</Text>
          <Text style={styles.txtEmailStyle}>{item.note}</Text>
          {item.status === 1 ? (
            <Text style={styles.txtEmail}>Trạng thái: thành công</Text>
          ) : (
            <Text style={styles.txtEmail}>Trạng thái: thất bại</Text>
          )}
        </View>
      </View>
    ),
    [],
  );

  useEffect(() => {
    //getUsers();
    getHistoryCheckout();
    //getCurrentDate();
    //getCurrentDate();
    //onChangeFromDate();
  }, [fromdate, todate, page, currentDate1WeekAway, currentDate]);

  return (
    <>
      <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
        <View style={{flex: 1, marginHorizontal: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: '40%'}}>
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
            <View style={{width: '40%'}}>
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
      </SafeAreaView>
    </>
  );
};

export default HistoryCheckout;

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
  },
  txtEmailStyle: {
    color: '#777',
  },
  loaderStyle: {
    marginVertical: 16,
    alignItems: 'center',
  },
});
