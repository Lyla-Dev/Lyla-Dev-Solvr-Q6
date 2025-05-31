import { Text, View, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 권장 취침시간은</Text>
      {/* 여기에 수면 시간 리스트가 들어갈 예정입니다 */}
      <Text>수면 시간 리스트 (예정)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // 상단에 배치
    alignItems: 'center',
    paddingTop: 50, // 상단 여백
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});