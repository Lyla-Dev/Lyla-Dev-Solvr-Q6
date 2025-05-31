import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native'; // 스타일을 위해 추가

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'tomato', // 활성화된 탭 색상
        tabBarInactiveTintColor: 'gray', // 비활성화된 탭 색상
        headerShown: false, // 각 화면의 헤더 숨기기 (필요에 따라 true로 변경 가능)
        tabBarStyle: styles.tabBar, // 탭 바 스타일 적용
      }}
    >
      <Tabs.Screen
        name="report" // 파일명과 동일하게 설정 (report.tsx)
        options={{
          title: '레포트',
          tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index" // 파일명과 동일하게 설정 (index.tsx)
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add" // 파일명과 동일하게 설정 (add.tsx)
        options={{
          title: '추가',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 90, // 탭 바 높이 증가 (아이폰 X 이상 노치 디자인 고려)
    paddingBottom: 20, // 하단 패딩 추가
  },
});