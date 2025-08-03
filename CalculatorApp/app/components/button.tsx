import React, { FC } from 'react';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

const { width } = Dimensions.get('screen');
const btnRatio = 4;
const btnWidth = width / btnRatio;

interface Props {
  style?: StyleProp<ViewStyle>;
  title: string;
  onPress?(): void;
  color?: string;          // Background color
  textColor?: string;      // Optional text color
}

const CalcButton: FC<Props> = ({ style, title, onPress, color = 'blue', textColor = '#fff' }) => {
  return (
    <TouchableOpacity
      style={[styles.buttonWrapper, style, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
  },
});

export default CalcButton;
