import express from 'express';
import pool from '../db';
import jwt from 'jsonwebtoken';
class UserController {
    private createToken(Data: { email: String }): { expiresIn: number; token: String } {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        return {
            expiresIn,
            token: jwt.sign(Data, secret, { expiresIn })
        };
    }
    public async get(req: express.Request, res: express.Response) {
        try {
            const client = await pool.connect();
            const sql = 'SELECT * FROM employee';
            const { rows } = await client.query(sql);
            const users = rows;
            client.release();
            res.status(200).send(users);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    public async post(
        req: {
            body: {
                last_name: String;
                first_name: String;
                title: String;
                email: String;
                password: String;
            };
        },
        res: express.Response
    ) {
        try {
            const client = await pool.connect();
            const sql = `INSERT INTO employee (last_name, first_name, title, email, password) VALUES('${req.body.last_name}','${req.body.first_name}','${req.body.title}','${req.body.email}','${req.body.password}')`;
            const { rowCount } = await client.query(sql);
            if (rowCount == 1) {
                const data = this.createToken({ email: req.body.email });
                res
                    .cookie('auth_token', data)
                    .status(200)
                    .send({ rowCount: rowCount, result: rowCount == 1 ? true : false });
            }
            client.release();
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public async login(req: { body: { email: String, password: String } }, res: express.Response) {
        try {
            const client = await pool.connect();
            const sql = `SELECT password FROM employee WHERE email=${req.body.email}`;
            const { rows } = await client.query(sql);
            const result = await client.query(sql);
            const users = rows;
            client.release();
            res.status(200).send(result);
        } catch (error) {
            res.status(404).send(error);
        }
    }
    public async update(
        req: { body: { first_name: String; last_name: String; title: String; id: number } },
        res: express.Response
    ) {
        try {
            const client = await pool.connect();
            const sql = `UPDATE employee SET FIRST_NAME='${req.body.first_name}',LAST_NAME='${req.body.last_name}',TITLE='${req.body.title}' WHERE employee_id=${req.body.id}`;
            const { rowCount } = await client.query(sql);
            client.release();
            res.status(200).send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
        } catch (error) {
            res.status(500).send(error);
        }
    }
    public async delete(req: { params: { id: number } }, res: express.Response) {
        try {
            const client = await pool.connect();
            const sql = `DELETE FROM employee WHERE employee_id=${req.params.id}`;
            const { rowCount } = await client.query(sql);
            client.release();
            res.send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

export default UserController;
