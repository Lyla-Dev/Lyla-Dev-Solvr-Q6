import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db'; // 데이터베이스 연결 함수
import sleepRoutes from './routes/sleepRoutes'; // 새로 만든 수면 기록 라우터

dotenv.config(); // .env 파일 로드

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 활성화
app.use(express.json()); // JSON 요청 본문 파싱

// 데이터베이스 연결
connectDB();

// 라우터 등록
app.use('/api', sleepRoutes); // '/api' 경로 접두사 아래에 수면 기록 라우터 연결

// 기본 라우트 (선택 사항)
app.get('/', (req, res) => {
  res.send('Sleep Tracker API Server is running!');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});