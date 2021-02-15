import express from 'express';
import pool from '../db';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
class UserController {
  public async get(req: express.Request, res: express.Response) {
    try {
      const client = await pool.connect();
      const sql = 'SELECT * FROM EMPLOYEE';
      const { rows } = await client.query(sql);
      const EMPLOYEE = rows;
      client.release();
      res.status(200).send(EMPLOYEE);
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
        password: string;
      };
    },
    res: express.Response
  ) {
    try {
      const client = await pool.connect();
      const salt = await bcryptjs.genSalt(10);
      var password = await bcryptjs.hash(req.body.password, salt);
      req.body.password = password.replace('/s', '');
      const sql = `INSERT INTO EMPLOYEE (last_name, first_name, title, email, password) VALUES('${req.body.last_name}','${req.body.first_name}','${req.body.title}','${req.body.email}','${req.body.password}')`;
      const { rowCount } = await client.query(sql);
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
    } catch (error) {
      res.status(500).send(error);
    }
  }
  public async login(req: { body: { email: String; password: string } }, res: express.Response) {
    try {
      const client = await pool.connect();
      const sql = `SELECT password FROM EMPLOYEE WHERE email='${req.body.email}'`;
      const { rows } = await client.query(sql);
      const result = bcryptjs.compare(req.body.password, rows[0].password);
      client.release();
      if (result) {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const token = { expiresIn: expiresIn, token: jwt.sign(req.body.email, secret) };
        res.setHeader('authorization', token.token);
        res.status(200).send(token);
      }
    } catch (error) {
      res.status(404).send(error);
    }
  }
  public async update(
    req: { body: { first_name: String; last_name: String; title: String; email: String } },
    res: express.Response
  ) {
    try {
      const client = await pool.connect();
      const sql = `UPDATE EMPLOYEE SET FIRST_NAME='${req.body.first_name}',LAST_NAME='${req.body.last_name}',TITLE='${req.body.title}' WHERE EMAIL='${req.body.email}'`;
      const { rowCount } = await client.query(sql);
      client.release();
      res.status(200).send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
    } catch (error) {
      res.status(500).send(error);
    }
  }
  public async delete(req: { params: { email: number } }, res: express.Response) {
    try {
      const client = await pool.connect();
      const sql = `DELETE FROM EMPLOYEE WHERE email=${req.params.email}`;
      const { rowCount } = await client.query(sql);
      client.release();
      res.send({ rowcount: rowCount, result: rowCount == 1 ? true : false });
    } catch (error) {
      res.status(400).send(error);
    }
  }
}

export default UserController;
