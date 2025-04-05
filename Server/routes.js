import express from 'express';
import cors from 'cors';
import temp from './temp.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userTask from './routes/userTaskRoutes.js';

const router = express.Router();

router.options('*', cors({ origin: '*', optionsSuccessStatus: 200 }));
router.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get('/payment', (req, res) => {
  res.render('index');
});

router.use('/', temp);
router.use('/api/public', publicRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/user', userRoutes);
router.use('/api/payment', paymentRoutes);
router.use('/api/user/uploads', uploadRoutes);
router.use('/api/user/task', userTask);

router.get('/', (req, res) => {
  res.send('Hello World, from express.');
});

export default router;