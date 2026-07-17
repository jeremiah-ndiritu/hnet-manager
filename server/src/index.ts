import express from 'express';
import cors from 'cors';
import wifiRouter from './routes/wifi.routes.ts';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/wifi', wifiRouter);

app.listen(PORT, () => {
  console.log(Server running quietly on http://localhost:\);
});
