import { Pool } from 'pg';
import { DB_CONFIG } from "../сonstants";

var poolRoot: Pool;

const getPoolRoot = () => {
    if (poolRoot) return poolRoot;
    poolRoot = new Pool({
        host: DB_CONFIG.HOST,
        port: DB_CONFIG.PORT,
        user: DB_CONFIG.USER,
        password: DB_CONFIG.PASSWORD,
        database: DB_CONFIG.DB,
        max: 40,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
    return poolRoot;
};

export default class DB {
    /**
     * Выполнение запроса к БД
     * @param {string} sql like 'SELECT ? AS RESULT'
     * @param {[]} data like ['Hello World!']
     * @returns {Promise<any>}
     */
    static async executeQuery(sql: string, data: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            getPoolRoot().connect((err, connection, release) => {
                if (err) return reject(err.stack);
                connection.query(sql, data, (err, result) => {
                    release();
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });
    }
}


export const query = (sql: string, params: any[], callback: any) => {
    const pool = new Pool({
        host: DB_CONFIG.HOST,
        user: DB_CONFIG.USER,
        password: DB_CONFIG.PASSWORD,
        database: DB_CONFIG.DB,
        port: DB_CONFIG.PORT,
        max: 1000,
        idleTimeoutMillis: 60000,
        connectionTimeoutMillis: 0,
    });
    return pool.query(sql, params, callback);
}