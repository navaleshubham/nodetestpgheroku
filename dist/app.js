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
// initialize the express server
const app = express();
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
            const sql = `CREATE TABLE employee
                   (first_name CHAR(20) NOT NULL, 
                   last_name CHAR(20) NOT NULL,
                   title CHAR(20) NOT NULL,
                   email CHAR(50) NOT NULL,
                   password CHAR(50) NOT NULL,
                   PRIMARY KEY(email))`;
            const result = yield client.query(sql);
            console.log(result);
        }
        catch (error) {

        }
    });
}
//auth check middleware
function authentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookie = req.cookies;
        const result = yield jwt.verify(cookie.auth_token, process.env.JWT_SECRET);
        const user = yield checkuser(result);
        if (user) {
            next();
        }
        else {
            res.send(user);
        }
    });
}
function checkuser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield Pool.connect();
            const sql = `SELECT * FROM employee WHERE email=${data.email}`;
            const { rows } = yield client.query(sql);
            const users = rows;
            client.release();
            if (users.length == 1) {
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