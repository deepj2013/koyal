import express from 'express';
import cors from 'cors';
import temp from './temp.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userTask from './routes/userTaskRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const router = express.Router();

router.options('*', cors({ origin: '*', optionsSuccessStatus: 200 }));
router.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

router.use(express.json({ limit: '200mb' }));
router.use(express.urlencoded({ extended: true, limit: '200mb' }));


router.get('/payment', (req, res) => {
  res.render('index');
});

router.use('/', temp);
router.use('/public', publicRoutes);
router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
router.use('/payment', paymentRoutes);
router.use('/user/uploads', uploadRoutes);
router.use('/user/task', userTask);
router.use("/user/ai", aiRoutes);

router.get('/route', (req, res) => {
  res.send('Hello World, from express.');
});

export default router;