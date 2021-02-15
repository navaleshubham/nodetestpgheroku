var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
class UserController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const sql = 'SELECT * FROM EMPLOYEE';
                const { rows } = yield client.query(sql);
                const EMPLOYEE = rows;
                client.release();
                res.status(200).send(EMPLOYEE);
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const salt = yield bcryptjs.genSalt(10);
                var password = yield bcryptjs.hash(req.body.password, salt);
                req.body.password = password.replace('\/s', "");
                console.log(req.body)
                const sql = `INSERT INTO EMPLOYEE (last_name, first_name, title, email, password) VALUES('${req.body.last_name}','${req.body.first_name}','${req.body.title}','${req.body.email}','${req.body.password}')`;
                const { rowCount } = yield client.query(sql);
                if (rowCount == 1) {
                    const expiresIn = 60 * 60; // an hour
                    const secret = process.env.JWT_SECRET;
                    const token = { expiresIn: expiresIn, token: jwt.sign(req.body.email, secret) };
                    res.setHeader('authorization', token.token);
                    res
                        .status(200)
                        .send({ rowCount: rowCount, result: rowCount == 1 ? true : false, token: token });
                }
                client.release();
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const sql = `SELECT password FROM EMPLOYEE WHERE email='${req.body.email}'`;
                const { rows } = yield client.query(sql);
                const result = bcryptjs.compare(req.body.password, rows[0].password);
                client.release();
                if (result) {
                    const expiresIn = 60 * 60; // an hour
                    const secret = process.env.JWT_SECRET;
                    const token = { expiresIn: expiresIn, token: jwt.sign(req.body.email, secret) };
                    res.setHeader('authorization', token.token);
                    res
                        .status(200)
                        .send(token);
                }
            }
            catch (error) {
                res.status(404).send(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const sql = `UPDATE EMPLOYEE SET FIRST_NAME='${req.body.first_name}',LAST_NAME='${req.body.last_name}',TITLE='${req.body.title}' WHERE EMAIL='${req.body.email}'`;
                const { rowCount } = yield client.query(sql);
                client.release();
                res.status(200).send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                console.log(req.params.id)
                const sql = `DELETE FROM EMPLOYEE WHERE email='${req.params.id}'`;
                const { rowCount } = yield client.query(sql);
                client.release();
                res.send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
            }
            catch (error) {
                res.status(400).send(error);
            }
        });
    }
}
export default UserController;
//# sourceMappingURL=user.js.map