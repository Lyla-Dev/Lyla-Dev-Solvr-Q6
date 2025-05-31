import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router'; // 화면 포커스 시 데이터 새로고침

// 수면 기록 타입 정의 (백엔드 응답에 맞춰 조절)
interface SleepRecord {
  _id: string; // 또는 id
  startTime: string;
  endTime: string;
  notes: string;
  createdAt?: string; // 추가될 수 있는 필드
}

export default function HomeScreen() {
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 수면 기록 불러오는 함수
  const fetchSleepRecords = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 실제 백엔드 서버의 IP 주소와 포트로 변경하세요!
      const response = await fetch('http://192.168.0.28/api/sleep-records'); // GET 요청
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SleepRecord[] = await response.json();
      // 최신 기록이 위에 오도록 정렬 (선택 사항)
      const sortedData = data.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
      setSleepRecords(sortedData);
    } catch (error) {
      console.error('수면 기록 불러오기 실패:', error);
      Alert.alert('오류', '수면 기록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
      setRefreshing(false); // 새로고침 완료
    }
  }, []);

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      fetchSleepRecords();
      return () => {
        // 클린업 함수 (필요시)
      };
    }, [fetchSleepRecords])
  );

  // 당겨서 새로고침 핸들러
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSleepRecords();
  }, [fetchSleepRecords]);

  // 각 리스트 아이템 렌더링
  const renderItem = ({ item }: { item: SleepRecord }) => {
    const start = new Date(item.startTime);
    const end = new Date(item.endTime);

    // 수면 시간 계산 (선택 사항)
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationText = `${hours}시간 ${minutes}분`;

    return (
      <View style={styles.recordItem}>
        <Text style={styles.recordDate}>
          {start.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
        </Text>
        <Text style={styles.recordTime}>
          {start.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} ~
          {end.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.recordDuration}>총 수면 시간: {durationText}</Text>
        {item.notes ? <Text style={styles.recordNotes}>특이사항: {item.notes}</Text> : null}
      </View>
    );
  };

  if (loading && !refreshing) { // 초기 로딩 시에만 로딩 인디케이터 표시
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>기록 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 권장 취침시간은</Text>
      <Text style={styles.subtitle}>수면 기록</Text>

      {sleepRecords.length === 0 ? (
        <Text style={styles.noRecordsText}>아직 기록된 수면이 없습니다. 추가 탭에서 기록해보세요!</Text>
      ) : (
        <FlatList
          data={sleepRecords}
          renderItem={renderItem}
          keyExtractor={(item) => item._id} // 각 항목의 고유 ID 사용
          contentContainerStyle={styles.listContent}
          refreshControl={ // 당겨서 새로고침 기능
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#555',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20, // 탭 바에 가리지 않도록
  },
  recordItem: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    width: '95%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  recordDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  recordTime: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  recordDuration: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007bff',
    marginBottom: 5,
  },
  recordNotes: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  noRecordsText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 50,
    textAlign: 'center',
  },
});