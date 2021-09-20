import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import entity from './app/routes/entity.routes';
import auth from './app/routes/auth.routes';

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: '*',
}

app.use(cors(corsOptions));

app.use(bodyParser.json({}));

app.use('/api/entity', entity);
app.use('/api/auth', auth);


app.get('/', (req, res) => res.json({ message: 'Express + TypeScript Server' }));
app.get('/test', async (req, res) => {
    //checkNewLandersTrigger();
    res.json({});
});
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});