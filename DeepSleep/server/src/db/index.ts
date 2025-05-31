import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('MongoDB URI가 설정되지 않았습니다. .env 파일을 확인해주세요.');
      process.exit(1); // 환경 변수가 없으면 종료
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB 연결 성공!');
  } catch (err: any) {
    console.error('MongoDB 연결 실패:', err.message);
    process.exit(1); // 오류 발생 시 종료
  }
};

export default connectDB;