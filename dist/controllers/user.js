var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pool from '../db';
import jwt from 'jsonwebtoken';
class UserController {
    createToken(Data) {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        return {
            expiresIn,
            token: jwt.sign(Data, secret, { expiresIn })
        };
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const sql = 'SELECT * FROM employee';
                const { rows } = yield client.query(sql);
                const users = rows;
                client.release();
                res.status(200).send(users);
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
                const sql = `INSERT INTO employee (last_name, first_name, title, email, password) VALUES('${req.body.last_name}','${req.body.first_name}','${req.body.title}','${req.body.email}','${req.body.password}')`;
                const { rowCount } = yield client.query(sql);
                if (rowCount == 1) {
                    const data = this.createToken({ email: req.body.email });
                    res
                        .cookie('auth_token', data)
                        .status(200)
                        .send({ rowCount: rowCount, result: rowCount == 1 ? true : false });
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
                const sql = `SELECT password FROM employee WHERE email=${req.body.email}`;
                const { rows } = yield client.query(sql);
                const result = yield client.query(sql);
                const users = rows;
                client.release();
                res.status(200).send(result);
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
                const sql = `UPDATE employee SET FIRST_NAME='${req.body.first_name}',LAST_NAME='${req.body.last_name}',TITLE='${req.body.title}' WHERE employee_id=${req.body.id}`;
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
                const sql = `DELETE FROM employee WHERE employee_id=${req.params.id}`;
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