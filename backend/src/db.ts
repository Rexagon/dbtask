import mysql, { Pool } from "mysql";

class Database {
  pool: Pool;

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
      timezone: "+03:00"
    });
  }

  public close() {
    this.pool.end(err => {
      console.log(err);
    });
  }

  public query<T>(sql: string, props?: Array<any>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        connection.query(sql, props, function(err, res) {
          if (err) reject(err);
          else resolve(res as T);
        });
        connection.release();
      });
    });
  }

  public escape<T>(object: T): string {
    return this.pool.escape(object);
  }
}

const db = new Database();

export default db;

export function escape<T>(value: T): string {
  return db.escape(value);
}
