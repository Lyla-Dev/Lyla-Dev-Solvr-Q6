import { Router } from 'express'; // <-- 여기도 'express'에서 가져오는지 확인
import { createSleepRecord, getSleepRecords } from '../controllers/sleepController';

const router = Router();

router.post('/sleep-records', createSleepRecord);
router.get('/sleep-records', getSleepRecords);

export default router;