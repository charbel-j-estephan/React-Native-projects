import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

import CalcButton from './app/components/button';
import { useState } from 'react';

const btnRatio = 4;
const btnGap = 5;
const paddingSize = 5;

const { width } = Dimensions.get('screen');
const btnWidth = (width - btnGap * btnRatio) / btnRatio - paddingSize / 2;

const buttons1 = ['7', '8', '9'];
const buttons2 = ['4', '5', '6'];
const buttons3 = ['1', '2', '3'];

const B1 = "#505050";
const B2 = "#1c1c1c";
const B3 = "#FF9500";

export default function App() {
  const [currentNumbers, setCurrentNumbers] = useState<string[]>([]);
  const [result, setResult] = useState<string>("");
  const [justEvaluated, setJustEvaluated] = useState(false);

const handleOnPress = (value: string) => {
  const operators = ['+', '-', '*', '/'];
  const last = currentNumbers[currentNumbers.length - 1];

  // If last action was "=" and user starts typing again
  if (justEvaluated) {
    // If typing a number (start new expression)
    if (!operators.includes(value)) {
      if (value === '.') {
        setCurrentNumbers(['0.']);
      } else {
        setCurrentNumbers([value]);
      }
    } else {
      // If typing an operator, start with result then operator
      if (result !== "") {
        setCurrentNumbers([result, value]);
      } else {
        return;
      }
    }
    setJustEvaluated(false);
    return;
  }

  // Normal behavior
  if (!operators.includes(value)) {
    if (last === undefined || operators.includes(last)) {
      if (value === '.') {
        setCurrentNumbers([...currentNumbers, '0.']);
      } else {
        setCurrentNumbers([...currentNumbers, value]);
      }
    } else {
      if (value === '.' && last.includes('.')) return;
      const newLast = last + value;
      const newArr = [...currentNumbers.slice(0, -1), newLast];
      setCurrentNumbers(newArr);
    }
  } else {
    if (last === undefined || operators.includes(last)) return;
    setCurrentNumbers([...currentNumbers, value]);
  }
};

  const handleOnRemove = () => {
    const oldItems = [...currentNumbers];
    oldItems.pop();
    setCurrentNumbers(oldItems);
  };

  const plusMinus = () => {
    if (currentNumbers.length > 0) {
      const last = currentNumbers[currentNumbers.length - 1];
      if (!isNaN(Number(last))) {
        if (last.startsWith('-')) {
          setCurrentNumbers([...currentNumbers.slice(0, -1), last.slice(1)]);
        } else {
          setCurrentNumbers([...currentNumbers.slice(0, -1), '-' + last]);
        }
      }
    }
  };

  const percentage = () => {
    if (currentNumbers.length > 0) {
      const last = currentNumbers[currentNumbers.length - 1];
      if (!isNaN(Number(last))) {
        const percentageValue = (parseFloat(last) / 100).toString();
        setCurrentNumbers([...currentNumbers.slice(0, -1), percentageValue]);
      }
    }
  };

const handleEvaluate = () => {
  try {
    const expression = currentNumbers.join('');
    const evalResult = eval(expression); // Use safe parser later
    setResult(evalResult.toString());
    setJustEvaluated(true); // Set the flag
  } catch (e) {
    setResult("Error");
    setJustEvaluated(false);
  }
};



  return (
    <View style={styles.container}>
      <View style={styles.ResultContainer}>
        <Text style={styles.calculations}>{currentNumbers.join('')}</Text>
        <Text style={styles.result}>{result}</Text>
      </View>

      <View style={styles.ButtonContainer}>
        <CalcButton onPress={() => { setCurrentNumbers([]); setResult(""); setJustEvaluated(false);}} title={"AC"} style={styles.calcBtn} color={B1} />
        <CalcButton onPress={() => percentage()} title={"%"} style={styles.calcBtn} color={B1} />
        <CalcButton onPress={() => plusMinus()} title={"±"} style={styles.calcBtn} color={B1} />
        <CalcButton onPress={() => handleOnPress('/')} title={"/"} style={styles.calcBtn} color={B3} />

        {buttons1.map(btn => (
          <CalcButton onPress={() => handleOnPress(btn)} key={btn} title={btn} style={styles.calcBtn} color={B2} />
        ))}
        <CalcButton onPress={() => handleOnPress('*')} title={"×"} style={styles.calcBtn} color={B3} />

        {buttons2.map(btn => (
          <CalcButton onPress={() => handleOnPress(btn)} key={btn} title={btn} style={styles.calcBtn} color={B2} />
        ))}
        <CalcButton onPress={() => handleOnPress('-')} title={"−"} style={styles.calcBtn} color={B3} />

        {buttons3.map(btn => (
          <CalcButton onPress={() => handleOnPress(btn)} key={btn} title={btn} style={styles.calcBtn} color={B2} />
        ))}
        <CalcButton onPress={() => handleOnPress('+')} title={"+"} style={styles.calcBtn} color={B3} />

        <CalcButton onPress={handleOnRemove} title={"DEL"} style={styles.calcBtn} color={B2} />
        <CalcButton onPress={() => handleOnPress('0')} title={"0"} style={styles.calcBtn} color={B2} />
        <CalcButton onPress={() => handleOnPress('.')} title={"."} style={styles.calcBtn} color={B2} />
        <CalcButton onPress={handleEvaluate} title={"="} style={styles.calcBtn} color={B3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-end'
  },
  ResultContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 10,
  },
  ButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: btnGap,
    paddingHorizontal: paddingSize,
    alignContent: "flex-end",
    paddingBottom: 20,
  },
  calcBtn: {
    width: btnWidth,
    height: btnWidth,
    borderWidth: 1,
    borderRadius: btnWidth / 2,
  },
  result: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#D4D4D2',
    fontFamily:"Orbitron Regular",
  },
  calculations: {
    fontWeight: '700',
    fontSize: 25,
    color: '#D4D4D2',
    opacity: 0.5
  }
});
