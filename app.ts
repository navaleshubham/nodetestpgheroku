//library
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
//class and functions
import Pool from './db';
import userrouter from './routes/user';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

// initialize the express server
const app = express();
dotenv.config();
// database conection test
Pool.connect(function (err: any, _client: any, _done: any) {
  if (err) console.log(err);
  creteorchecktable();
  console.log('Connected all okay');
});

async function creteorchecktable() {
  try {
    const client = await Pool.connect();
    const sql = `CREATE TABLE EMPLOYEE
                   (first_name CHAR(20) NOT NULL, 
                   last_name CHAR(20) NOT NULL,
                   title CHAR(20) NOT NULL,
                   email CHAR(50) NOT NULL,
                   password CHAR(1000) NOT NULL,
                   PRIMARY KEY(email))`;
    const result = await client.query(sql);
    console.log(result);
  } catch (error) {
    console.log('table already exists');
  }
}
//auth check middleware
async function authentication(req: express.Request, res: express.Response, next) {
  try {
    const token = await req.headers.authorization;
    console.log(req.headers.authorization);
    const result = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await checkuser(result);
    if (user) {
      next();
    } else {
      res.status(404).send('user not found please check credentials and try again');
    }
  } catch {
    console.log('token not found');
    if (req.path == '/user/new' || req.path == '/user/login') {
      next();
    } else {
      res.status(404).send('token not found please login and try again');
    }
  }
}

async function checkuser(data) {
  try {
    const client = await Pool.connect();
    const sql = `SELECT * FROM EMPLOYEE WHERE email=${data.email}`;
    const { rows } = await client.query(sql);
    const EMPLOYEE = rows;
    client.release();
    if (EMPLOYEE.length == 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
}
//configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(authentication);
app.use(cookieParser());
//routes
app.use('/user', userrouter);

//demo route
// app.get('/', (req, res, next) => {
//     res.send('Hello world')
// })

// Define the port to run the server. this could either be defined
app.listen(process.env.PORT || 4000, () => {
  console.log('server started on port', process.env.PORT || 4000);
});
