import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList,
  Image
} from 'react-native';

import CalcButton from './app/components/button';
import { themes } from './theme';

const btnRatio = 4;
const btnGap = 5;
const paddingSize = 5;

const { width } = Dimensions.get('screen');
const btnWidth = (width - btnGap * btnRatio) / btnRatio - paddingSize / 2;

const buttons1 = ['7', '8', '9'];
const buttons2 = ['4', '5', '6'];
const buttons3 = ['1', '2', '3'];

type ThemeKey = keyof typeof themes;

export default function App() {
  const [currentNumbers, setCurrentNumbers] = useState<string[]>([]);
  const [result, setResult] = useState<string>('');
  const [justEvaluated, setJustEvaluated] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('dark');
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const theme = themes[currentTheme];

  const handleOnPress = (value: string) => {
    const operators = ['+', '-', '*', '/'];
    const last = currentNumbers[currentNumbers.length - 1];

    if (justEvaluated) {
      if (!operators.includes(value)) {
        if (value === '.') {
          setCurrentNumbers(['0.']);
        } else {
          setCurrentNumbers([value]);
        }
      } else {
        if (result !== '') {
          setCurrentNumbers([result, value]);
        } else {
          return;
        }
      }
      setJustEvaluated(false);
      return;
    }

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
      const evalResult = eval(expression);
      setResult(evalResult.toString());
      setJustEvaluated(true);
    } catch (e) {
      setResult('Error');
      setJustEvaluated(false);
    }
  };

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>

      {/* Top left theme button */}
      <TouchableOpacity
        style={styles.themeButton}
        onPress={() => setThemeModalVisible(true)}
      >
        <Image
    source={require('./assets/icons/control.png')}
    style={{ width: 24, height: 24, tintColor: theme.text }}
    resizeMode="contain"
  />
      </TouchableOpacity>


      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Theme</Text>
            <FlatList
              data={Object.keys(themes) as ThemeKey[]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, { backgroundColor: currentTheme === item ? theme.B3 : theme.B1 }]}
                  onPress={() => {
                    setCurrentTheme(item);
                    setThemeModalVisible(false);
                  }}
                >
                  <Text style={{ color: theme.text, fontSize: 18 }}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalCloseBtn, { borderColor: theme.text }]}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={{ color: theme.text }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.ResultContainer}>
        <Text style={[styles.calculations, { color: theme.text }]}>
          {currentNumbers.join('')}
        </Text>
        <Text style={[styles.result, { color: theme.text }]}>
          {result}
        </Text>
      </View>

      <View style={styles.ButtonContainer}>
        <CalcButton onPress={() => { setCurrentNumbers([]); setResult(''); setJustEvaluated(false); }} title="AC" style={styles.calcBtn} color={theme.B1} textColor={theme.text}/>
        <CalcButton onPress={percentage} title="%" style={styles.calcBtn} color={theme.B1} textColor={theme.text} />
        <CalcButton onPress={plusMinus} title="±" style={styles.calcBtn} color={theme.B1}textColor={theme.text} />
        <CalcButton onPress={() => handleOnPress('/')} title="/" style={styles.calcBtn} color={theme.B3} textColor={theme.text}/>

        {buttons1.map((btn) => (
          <CalcButton key={btn} onPress={() => handleOnPress(btn)} title={btn} style={styles.calcBtn} color={theme.B2} textColor={theme.text} />
        ))}
        <CalcButton onPress={() => handleOnPress('*')} title="×" style={styles.calcBtn} color={theme.B3} textColor={theme.text}/>

        {buttons2.map((btn) => (
          <CalcButton key={btn} onPress={() => handleOnPress(btn)} title={btn} style={styles.calcBtn} color={theme.B2} textColor={theme.text} />
        ))}
        <CalcButton onPress={() => handleOnPress('-')} title="−" style={styles.calcBtn} color={theme.B3} textColor={theme.text}/>

        {buttons3.map((btn) => (
          <CalcButton key={btn} onPress={() => handleOnPress(btn)} title={btn} style={styles.calcBtn} color={theme.B2} textColor={theme.text}/>
        ))}
        <CalcButton onPress={() => handleOnPress('+')} title="+" style={styles.calcBtn} color={theme.B3} textColor={theme.text}/>

        <CalcButton onPress={handleOnRemove} title="DEL" style={styles.calcBtn} color={theme.B2} textColor={theme.text} />
        <CalcButton onPress={() => handleOnPress('0')} title="0" style={styles.calcBtn} color={theme.B2} textColor={theme.text}/>
        <CalcButton onPress={() => handleOnPress('.')} title="." style={styles.calcBtn} color={theme.B2} textColor={theme.text}/>
        <CalcButton onPress={handleEvaluate} title="=" style={styles.calcBtn} color={theme.B3} textColor={theme.text}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  themeButton: {
  position: 'absolute',
  top: Platform.OS === 'ios' ? 50 : 30,
  left: 15,
  padding: 10,
  borderRadius: 50,
  zIndex: 10,
},

  container: {
    paddingTop: 30,
    flex: 1,
    justifyContent: 'flex-end',
  },
  ResultContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 10,
  },
  ButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: btnGap,
    paddingHorizontal: paddingSize,
    alignContent: 'flex-end',
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
    fontFamily: 'Orbitron Regular',
  },
  calculations: {
    fontWeight: '700',
    fontSize: 25,
    opacity: 0.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginBottom: 10,
  },
  modalCloseBtn: {
    marginTop: 15,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
});
