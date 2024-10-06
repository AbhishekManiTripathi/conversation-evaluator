import express, { request, response } from "express";
import mongoose from "mongoose";
import { PORT, mongoDBURL } from "./config.js";
import { QueryLog } from "./models/queryModel.js";
import queryLogsRoute from './routes/queryLogsRoutes.js'
import cors from 'cors';

const app = express();
app.use(express.json());
// allow all origin with default of cors(*)
app.use(cors());

app.get('/', (req,res) => {
   console.log(req)
  return res.status(200).send('welcome to the conversation evaluator')
})

app.use('/querylogs', queryLogsRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });



