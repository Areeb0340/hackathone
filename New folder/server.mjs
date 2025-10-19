import express from 'express'
import cors from "cors";
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import authApi from './api/auth.mjs';
import reportApi from "./api/report.mjs";
import vitalsApi from "./api/vitals.mjs";




const app = express();
const PORT = 5005;


// const server = createServer(app);
// const io = new Server(server, { cors: { origin: "http://localhost:3000", credentials: true, methods: "*"} });
mongoose.connect(process.env.MONGODBURL)
  .then(() => console.log('Connected!')).catch((error)=>console.log('err', error));

app.use(cors({
  origin: ['http://localhost:3000'], // frontend origin
  credentials: true,
      methods: "*" 
}));
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/',authApi)
app.use("/api/v1", reportApi);
app.use("/api/v1", vitalsApi);

app.listen(PORT, () => {
    console.log("Server is Running")
})

mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});