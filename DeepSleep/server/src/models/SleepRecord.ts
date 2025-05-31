import { Schema, model, Document } from 'mongoose';

// SleepRecord 문서의 타입 정의
export interface ISleepRecord extends Document {
  startTime: Date;
  endTime: Date;
  notes?: string; // 특이사항은 선택 사항
  createdAt: Date;
}

const SleepRecordSchema = new Schema<ISleepRecord>({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  notes: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

const SleepRecord = model<ISleepRecord>('SleepRecord', SleepRecordSchema);

export default SleepRecord;