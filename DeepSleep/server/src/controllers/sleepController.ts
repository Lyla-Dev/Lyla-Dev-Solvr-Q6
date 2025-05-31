import { Request, Response } from 'express'; // TypeScript에게 이것이 Express의 Request/Response 타입임을 명확히 알려줍니다.
// import * as express from 'express'; // 또는 이렇게 명시적으로 임포트할 수도 있습니다.
// import { Request, Response } from 'express-serve-static-core'; // 간혹 이런 경우도 있습니다.

import SleepRecord from '../models/SleepRecord';

// 새로운 수면 기록 생성
export const createSleepRecord = async (req: Request, res: Response) => {
  try {
    const { startTime, endTime, notes } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({ message: '시작 시간과 종료 시간은 필수입니다.' });
    }

    const newRecord = new SleepRecord({
      startTime,
      endTime,
      notes,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error: any) {
    res.status(500).json({ message: '수면 기록 생성 중 오류 발생', error: error.message });
  }
};

// 모든 수면 기록 조회
export const getSleepRecords = async (req: Request, res: Response) => {
  try {
    const records = await SleepRecord.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error: any) {
    res.status(500).json({ message: '수면 기록 조회 중 오류 발생', error: error.message });
  }
};