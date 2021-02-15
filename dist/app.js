var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//library
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
//class and functions
import Pool from './db.js';
import userrouter from './routes/user.js';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
// initialize the express server
const app = express();
dotenv.config();
// database conection test
Pool.connect(function (err, _client, _done) {
    if (err)
        console.log(err);
    creteorchecktable();
    console.log('Connected all okay');
});
function creteorchecktable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield Pool.connect();
            const sql = `CREATE TABLE EMPLOYEE
                   (first_name CHAR(20) NOT NULL, 
                   last_name CHAR(20) NOT NULL,
                   title CHAR(20) NOT NULL,
                   email CHAR(50) NOT NULL,
                   password CHAR(1000) NOT NULL,
                   PRIMARY KEY(email))`;
            const result = yield client.query(sql);
            console.log(result);
        }
        catch (error) {
            console.log('table already exists');
        }
    });
}
//auth check middleware
function authentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.path == '/user/new' || req.path == '/user/login') {
                next();
            }
            else {
                const token = yield req.headers.authorization;
                const result = yield jwt.verify(token, process.env.JWT_SECRET);
                console.log(result)
                const user = yield checkuser(result);
                console.log(user)
                if (user) {
                    next();
                }
                else {
                    res.status(404).send('user not found please check credentials and try again');
                }
            }
        }
        catch (_a) {
            console.log('token not found');
            if (req.path == '/user/new' || req.path == '/user/login') {
                next();
            }
            else {
                res.status(404).send('token not found please login and try again');
            }
        }
    });
}
function checkuser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield Pool.connect();
            const sql = `SELECT * FROM EMPLOYEE WHERE email='${data}'`;
            const { rows } = yield client.query(sql);
            const EMPLOYEE = rows;
            client.release();
            if (EMPLOYEE.length == 1) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            return error;
        }
    });
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
//# sourceMappingURL=app.js.map