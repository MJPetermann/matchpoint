import 'dotenv/config'

import express from 'express';
import cors from 'cors'
const app = express();

const corsOptions = {
    origin: "*",
    methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};

express().use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello, World!');
})
  
  
app.listen(process.env.PORT, () => {
  console.log('MatchPoint Backend is running on Port '+ process.env.PORT);
});