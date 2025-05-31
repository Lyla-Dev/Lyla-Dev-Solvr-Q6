import React, { useState } from 'react';
import { Text, View, StyleSheet, Platform, TextInput, Button, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router'; // 화면 이동을 위해

export default function AddScreen() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const router = useRouter(); // Expo Router의 useRouter 훅 사용

  // 시간 선택 핸들러
  const onChangeStartTime = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startTime;
    setShowStartTimePicker(Platform.OS === 'ios'); // iOS에서는 즉시 닫히지 않음
    setStartTime(currentDate);
  };

  const onChangeEndTime = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endTime;
    setShowEndTimePicker(Platform.OS === 'ios');
    setEndTime(currentDate);
  };

  // 완료 버튼 핸들러
  const handleSave = async () => {
    // 유효성 검사 (예: 종료 시간이 시작 시간보다 빠른 경우)
    if (endTime.getTime() <= startTime.getTime()) {
      Alert.alert('오류', '종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }

    const sleepRecord = {
      startTime: startTime.toISOString(), // ISO 8601 형식으로 저장
      endTime: endTime.toISOString(),
      notes: notes,
    };

    try {
      // TODO: 실제 백엔드 서버의 IP 주소와 포트로 변경하세요!
      // 예: 'http://192.168.0.10:3000/api/sleep-records'
      // Expo 앱에서는 localhost를 직접 참조할 수 없습니다.
      const response = await fetch('http://192.168.0.28:3000/api/sleep-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sleepRecord),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('수면 기록 저장 성공:', result);
      Alert.alert('성공', '수면 기록이 저장되었습니다.');
      router.back(); // 이전 화면 (홈 화면)으로 돌아가기

    } catch (error) {
      console.error('수면 기록 저장 실패:', error);
      Alert.alert('오류', '수면 기록 저장에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>수면 기록 추가</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>시작 시간:</Text>
        <Button onPress={() => setShowStartTimePicker(true)} title="시작 시간 선택" />
        {showStartTimePicker && (
          <DateTimePicker
            testID="startTimePicker"
            value={startTime}
            mode="time" // 시간만 선택
            is24Hour={true}
            display="default"
            onChange={onChangeStartTime}
          />
        )}
        <Text style={styles.selectedTime}>
          선택: {startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>종료 시간:</Text>
        <Button onPress={() => setShowEndTimePicker(true)} title="종료 시간 선택" />
        {showEndTimePicker && (
          <DateTimePicker
            testID="endTimePicker"
            value={endTime}
            mode="time" // 시간만 선택
            is24Hour={true}
            display="default"
            onChange={onChangeEndTime}
          />
        )}
        <Text style={styles.selectedTime}>
          선택: {endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <Text style={styles.label}>특이사항:</Text>
      <TextInput
        style={styles.textInput}
        onChangeText={setNotes}
        value={notes}
        placeholder="특이사항을 입력하세요..."
        multiline
        numberOfLines={4}
      />

      <Button title="기록 완료" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
    color: '#555',
  },
  selectedTime: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top', // Android에서 상단부터 텍스트 시작
    marginBottom: 30,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});