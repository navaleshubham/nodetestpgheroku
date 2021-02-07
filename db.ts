import pkg from 'pg';
const { Pool } = pkg;

export default new Pool({
    connectionString: 'postgres://dvaserbibjnxpc:8d1073981bcdbcfd0db73331317bc4c5f9725114138556161f5c9de8d9ad6da7@ec2-52-6-178-202.compute-1.amazonaws.com:5432/d3qf7a0ook8rn9',
    idleTimeoutMillis: 30000,
    ssl: { rejectUnauthorized: false }//ssl issue resolved
});