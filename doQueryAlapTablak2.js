import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
// import { data } from './dataAlapTablak.js';

// const exampleData = [
//   { id: 'a', name: 'John', x: 'a' },
//   { id: 'b', name: 'Alice', x: 'b' },
//   { id: 'c', name: 'Bob', x: 'c' },
// ];

export const doQuery = async (responseData, table) => {
  if (!responseData || !responseData.length) {
    console.log('No data provided.');
    return;
  }
  const { name, columns } = table;
  ////////////////////////////////
  //   Unique queries based on table name
  let insertQuery, countQuery;
  switch (name) {
    // 3 columns, same table:
    case 'ATCKONYV':
    // case 'BNOKODOK':
    case 'NICHE':
      // case 'ISOKONYV':
      const valuesToInsert = responseData
        .map(
          row =>
            `(${Object.values(row)
              .map(value => (typeof value === 'string' ? `'${value}'` : value))
              .join(', ')})`
        )
        .join(', ');
      const insertionColumns = `(${columns.join(', ')})`;
      //   console.log(insertionColumns);
      //   console.log(valuesToInsert);
      insertQuery = `INSERT INTO ${name} ${insertionColumns} VALUES ${valuesToInsert}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    // TODO: Check if this is correct:
    case 'ISOKONYV':
      const valuesToInsert2 = responseData
        .map(row => {
          const filteredValues = Object.values(row).filter(value => value !== '-/-');
          const sqlValues = filteredValues.map(value => (typeof value === 'string' ? `'${value}'` : value));
          return `(${sqlValues.join(', ')})`;
        })
        .join(', ');
      const insertionColumns2 = `(${columns.join(', ')})`;
        // console.log(insertionColumns2);
        // console.log(valuesToInsert2);
      insertQuery = `INSERT INTO ${name} ${insertionColumns2} VALUES ${valuesToInsert2}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    default:
      console.log('No query defined for this table.');
      return;
  }
  ////////////////////////////////
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'testdb',
    password: process.env.DB_PASSWORD,
  });
  try {
    await pool.execute(insertQuery);
    const [results] = await pool.execute(countQuery);
    if (!results) {
      throw new Error(`No results found.`);
    }
    await pool.end();
    // console.log(results[0].count);
    return results[0].count;
  } catch (error) {
    console.log('Error executing query:', error.message);
    await pool.end();
  }
};

// doQuery(exampleData, data.ATCKONYV);
