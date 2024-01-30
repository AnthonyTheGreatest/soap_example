import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

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
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'testdb',
    password: process.env.DB_PASSWORD,
  });
  const { name, columns } = table;
  ////////////////////////////////
  //   Unique queries based on table name
  let insertQuery, countQuery;
  switch (name) {
    case 'ATCKONYV':
    case 'BNOKODOK':
    case 'NICHE':
      const valuesToInsert = responseData
        .map(
          row =>
            `(${Object.values(row)
              .map(value => {
                const parsedValue = parseInt(value);
                return isNaN(parsedValue) ? `'${value}'` : parsedValue;
              })
              .join(', ')})`
        )
        .join(', ');
      const insertionColumns = `(${columns.join(', ')})`;
      // console.log(insertionColumns);
      // console.log(valuesToInsert);
      insertQuery = `INSERT INTO ${name} ${insertionColumns} VALUES ${valuesToInsert}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    case 'ISOKONYV':
      const valuesToInsert4 = responseData
        .map(row => {
          const filteredValues = Object.values(row).filter(
            value => value !== '-/-' && value !== ''
          );
          const sqlValues = filteredValues.map(value => `'${value}'`);
          return `(${sqlValues.join(', ')})`;
        })
        .join(', ');
      const insertionColumns4 = `(${columns.join(', ')})`;
      // console.log(insertionColumns4);
      // console.log(valuesToInsert4);
      insertQuery = `INSERT INTO ${name} ${insertionColumns4} VALUES ${valuesToInsert4}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    case 'BRAND':
      const valuesToInsert2 = responseData
        .map(row => {
          const filteredValues = Object.values(row).filter(
            value => value !== '-/-' && value !== ''
          );
          const sqlValues = filteredValues.map(
            value => {
              const parsedValue = parseInt(value);
              return isNaN(parsedValue) ? `'${value}'` : parsedValue;
            }
            // typeof value === 'string' ? `'${value}'` : value
          );
          return `(${sqlValues.join(', ')})`;
        })
        .join(', ');
      const insertionColumns2 = `(${columns.join(', ')})`;
      // console.log(insertionColumns2);
      // console.log(valuesToInsert2);
      insertQuery = `INSERT INTO ${name} ${insertionColumns2} VALUES ${valuesToInsert2}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    case 'CEGEK':
      const valuesToInsert3 = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          const [ERV_KEZD, ERV_VEGE] = values[2].split('-');
          newValues.push(parseInt(values[0]));
          newValues.push(`'${values[1]}'`);
          newValues.push(`'${ERV_KEZD}'`);
          newValues.push(`'${ERV_VEGE}'`);
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      const insertionColumns3 = `(${columns.join(', ')})`;
      // console.log(insertionColumns3);
      // console.log(valuesToInsert3);
      insertQuery = `INSERT INTO ${name} ${insertionColumns3} VALUES ${valuesToInsert3}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    case 'KIINTOR':
      const valuesToInsert5 = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          const [INTEZET, EGYSEG] = values[1].split('|');
          newValues.push(parseInt(values[0]));
          newValues.push(`'${INTEZET}'`);
          newValues.push(`'${EGYSEG}'`);
          newValues.push(`'${values[2]}'`);
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      const insertionColumns5 = `(${columns.join(', ')})`;
      // console.log(insertionColumns5);
      // console.log(valuesToInsert5);
      insertQuery = `INSERT INTO ${name} ${insertionColumns5} VALUES ${valuesToInsert5}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    case 'SZAKVKODOK':
      const valuesToInsert6 = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          newValues.push(parseInt(values[0]));
          newValues.push(`'${values[1]}'`);
          newValues.push(parseInt(values[2]) || 0);
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      const insertionColumns6 = `(${columns.join(', ')})`;
      // console.log(insertionColumns6);
      // console.log(valuesToInsert6);
      insertQuery = `INSERT INTO ${name} ${insertionColumns6} VALUES ${valuesToInsert6}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    case 'ORVOSOK': // Nem műlködik, ha üres a szakvkodok tábla.
      const insertValues = [];
      for (const row of responseData) {
        const values = Object.values(row);
        // console.log(values);
        const [results] = await pool.execute(
          `SELECT * FROM SZAKVKODOK WHERE KOD = ${parseInt(
            values[1]
          )} AND LEIRAS = '${values[2]}'`
        );
        // console.log(results[0].ID);
        let newValues = [];
        newValues.push(`'${values[0]}'`);
        newValues.push(parseInt(results[0].ID));
        insertValues.push(`(${newValues.join(', ')})`);
      }
      const valuesToInsert7 = insertValues.join(', ');
      const insertionColumns7 = `(PECSETKOD, SZAKV_ID)`;
      // console.log(insertionColumns7);
      // console.log(valuesToInsert7);
      insertQuery = `INSERT INTO ${name} ${insertionColumns7} VALUES ${valuesToInsert7}`;
      countQuery = `SELECT COUNT(*) as count FROM ${name}`;
      break;
    default:
      console.log('No query defined for this table.');
      return;
  }
  ////////////////////////////////
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
