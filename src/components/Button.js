import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import COLORS from '../constants/colors';

const Button = props => {
  const filledBgColor = props.color || COLORS.primary;
  const outlineColor = COLORS.white;
  const disabled_background = COLORS.light_grey;
  const bgColor = props.disabled ? disabled_background : filledBgColor;
  const textColor = props.disabled ? COLORS.white : COLORS.white;
  return (
    <TouchableOpacity
      disabled={props.disabled}
      style={{
        ...styles.button,
        ...{backgroundColor: bgColor, borderColor: bgColor},
        ...props.style,
      }}
      onPress={props.onPress}>
      <Text style={{fontSize: 18, ...{color: textColor}}}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
})