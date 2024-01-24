import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// const exampleData = [
//     { id: 1, name: 'John', age: 25, city: 'New York' },
//     { id: 2, name: 'Alice', age: 30, city: 'San Francisco' },
//     { id: 3, name: 'Bob', age: 28, city: 'Los Angeles' }
//   ];

export const doQuery = async data => {
  if (!data || !data.length) {
    console.log('No data provided.');
    return;
  }
  const tablename = 'test_table';
  const columnsWithTypes = Object.keys(data[0])
    .map(
      column =>
        `${column} ${
          typeof data[0][column] === 'string' ? 'VARCHAR(255)' : 'INT'
        }`
    )
    .join(', ');
  const columns = Object.keys(data[0]).join(', ');
  const valuesToInsert = data
    .map(
      row =>
        `(${Object.values(row)
          .map(value => (typeof value === 'string' ? `'${value}'` : value))
          .join(', ')})`
    )
    .join(', ');
  const insertQuery = `INSERT INTO ${tablename} (${columns}) VALUES ${valuesToInsert}`;
  const countQuery = `SELECT COUNT(*) as count FROM ${tablename}`;

  try {
    // Put in app.js(?)
    const pool = mysql.createPool({
      host: 'localhost',
      user: 'root',
      database: 'testdb',
      password: process.env.DB_PASSWORD,
    });
    await pool.execute(`DROP TABLE IF EXISTS ${tablename}`);
    await pool.execute(`CREATE TABLE ${tablename} (${columnsWithTypes})`);
    await pool.execute(insertQuery);
    const [results] = await pool.execute(countQuery);
    if (!results) {
      throw new Error(`No results found.`);
    }
    await pool.end();
    // console.log(results[0].count);
    return results[0].count;
  } catch (error) {
    console.error('Query error:', error);
  }
};

// doQuery(exampleData);
