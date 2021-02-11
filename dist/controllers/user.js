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
class UserController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const sql = 'SELECT * FROM employees';
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
                const sql = `INSERT INTO employees (last_name, first_name, title) VALUES('${req.body.last_name}','${req.body.first_name}','${req.body.title}')`;
                const { rowCount } = yield client.query(sql);
                client.release();
                res.status(200).send({ rowCount: rowCount, result: rowCount == 1 ? true : false });
            }
            catch (error) {
                res.status(500).send(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield pool.connect();
                const sql = `UPDATE employees SET FIRST_NAME='${req.body.first_name}',LAST_NAME='${req.body.last_name}',TITLE='${req.body.title}' WHERE employee_id=${req.body.id}`;
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
                const sql = `DELETE FROM employees WHERE employee_id=${req.params.id}`;
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