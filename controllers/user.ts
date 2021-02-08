import pool from '../db';

class UserController {
    public async get(req: null, res: any) {
        try {
            const client = await pool.connect();
            const sql = 'SELECT * FROM employees';
            const { rows } = await client.query(sql);
            const users = rows;
            client.release();
            res.status(200).send(users);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    public async post(req: { body: { last_name: String; first_name: String; title: String; }; }, res: any) {
        try {
            const client = await pool.connect();
            const sql = `INSERT INTO employees (last_name, first_name, title) VALUES('${req.body.last_name}','${req.body.first_name}','${req.body.title}')`;
            const { rowCount } = await client.query(sql);
            client.release();
            res.status(200).send({ rowCount: rowCount, result: rowCount == 1 ? true : false });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public async update(req: { body: { first_name: String; last_name: String; title: String; id: number; }; }, res: any) {
        try {
            const client = await pool.connect();
            const sql = `UPDATE employees SET FIRST_NAME='${req.body.first_name}',LAST_NAME='${req.body.last_name}',TITLE='${req.body.title}' WHERE employee_id=${req.body.id}`;
            const { rowCount } = await client.query(sql);
            client.release();
            res.status(200).send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public async delete(req: { params: { id: number; }; }, res: any) {
        try {
            const client = await pool.connect();
            const sql = `DELETE FROM employees WHERE employee_id=${req.params.id}`;
            const { rowCount } = await client.query(sql);
            client.release();
            res.send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default UserController;
