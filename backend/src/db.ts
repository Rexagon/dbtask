import mysql, { Pool } from 'mysql';

export interface InsertionDBResponse {
  insertId: number;
}

class Database {
  private pool?: Pool;

  public init(config: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  }) {
    this.pool = mysql.createPool({
      database: config.database,
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      multipleStatements: true,
      timezone: '+03:00'
    });
  }

  public close() {
    if (!this.pool) return;

    this.pool.end((err) => {
      console.log(err);
    });
  }

  public query<T = InsertionDBResponse>(
    sql: string,
    props?: Array<any>
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.pool) {
        reject(new Error('pool is undefined'));
        return;
      }

      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
        } else {
          const query = connection.query(sql, props, (err, res) => {
            if (err) reject(err);
            else resolve(res as T);
          });
          //console.log(query.sql);
          connection.release();
        }
      });
    });
  }

  public escape<T>(object: T): string {
    if (!this.pool) {
      throw new Error('pool is undefined');
    }

    return this.pool.escape(object);
  }
}

const db = new Database();

export default db;
