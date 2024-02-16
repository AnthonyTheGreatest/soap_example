// const !exampleData = [
//   { id: 'a', name: 'John', x: 'a' },
//   { id: 'b', name: 'Alice', x: 'b' },
//   { id: 'c', name: 'Bob', x: 'c' },
// ];

export const doQuery = async (pool, responseData, table) => {
  if (!responseData || !responseData.length) {
    console.log('No data provided.');
    return;
  }
  const { name, columns } = table;
  if (name === 'TERMEK_ID_LIST') {
    return;
  }
  ////////////////////////////////
  let valuesToInsert, insertionColumns;
  switch (name) {
    case 'KIHIRDETES':
      valuesToInsert = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          newValues.push(`'${values[0]}'`);
          newValues.push(`'${values[1]}'`);
          newValues.push(parseInt(values[2]) || 0);
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'TERMEK':
      valuesToInsert = responseData.map(row => {
        let newValues = [];
        for (const [key, value] of Object.entries(row)) {
          if (key === 'ERV_VEGE' && value === '2099-12-31') {
            newValues.push(`'${value}'`); // (NOT NULL)
          } else if (typeof value === 'string') {
            if (
              value === '-/-' ||
              value === '-/' ||
              value === '-' ||
              value === '2099-12-31'
            ) {
              newValues.push('NULL');
            } else {
              newValues.push(`'${value}'`);
            }
          } else {
            if (value === 999999999.999999) {
              newValues.push('NULL');
            } else {
              newValues.push(value);
            }
          }
        }
        return `(${newValues.join(', ')})`;
      });
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'TAMALAP_KATEGTAM_EUHOZZAR':
      // TAMALAP:
      const tamalap = responseData[0];
      const tamalapValuesToInsert = tamalap.map(row => {
        let newValues = [];
        for (const [name, value] of Object.entries(row)) {
          if (
            value === '-/-' ||
            value === '-/' ||
            value === '-' ||
            value === '2099-12-31' ||
            value === 999999999.999999
          ) {
            if (value === '2099-12-31' && name === 'ERV_VEGE') {
              newValues.push(`'${value}'`); // (NOT NULL)
            } else {
              newValues.push('NULL');
            }
          } else if (typeof value === 'string') {
            newValues.push(`'${value}'`);
          } else {
            newValues.push(value);
          }
        }
        return `(${newValues.join(', ')})`;
      });
      const tamalapInsertionColumns = `(${columns[0].join(', ')})`;
      // KATEGTAM:
      const kategtam = responseData[1];
      const kategtamValuesToInsert = kategtam.map(row => {
        let newValues = [];
        for (const [, value] of Object.entries(row)) {
          if (
            value === '-/-' ||
            value === '-/' ||
            value === '-' ||
            value === '2099-12-31' ||
            value === 999999999.999999
          ) {
            newValues.push('NULL');
          } else if (typeof value === 'string') {
            newValues.push(`'${value}'`);
          } else {
            newValues.push(value);
          }
        }
        return `(${newValues.join(', ')})`;
      });
      const kategtamInsertionColumns = `(${columns[1].join(', ')})`;
      // EUHOZZAR:
      const eupontok = responseData[2];
      const eupontokValuesToInsert = eupontok.map(row => {
        let newValues = [];
        for (const [, value] of Object.entries(row)) {
          if (
            value === '-/-' ||
            value === '-/' ||
            value === '-' ||
            value === '2099-12-31' ||
            value === 999999999.999999
          ) {
            newValues.push('NULL');
          } else if (typeof value === 'string') {
            newValues.push(`'${value}'`);
          } else {
            newValues.push(value);
          }
        }
        return `(${newValues.join(', ')})`;
      });
      const eupontokInsertionColumns = `(${columns[2].join(', ')})`;
      // Get connection from pool
      const connection = await pool.getConnection();
      try {
        // Transaction:
        await connection.beginTransaction(); // Begin transaction

        await connection.execute(
          `INSERT INTO TAMALAP ${tamalapInsertionColumns} VALUES ${tamalapValuesToInsert}`
        );
        await connection.execute(
          `INSERT INTO KATEGTAM ${kategtamInsertionColumns} VALUES ${kategtamValuesToInsert}`
        );
        await connection.execute(
          `INSERT INTO EUHOZZAR ${eupontokInsertionColumns} VALUES ${eupontokValuesToInsert}`
        );

        await connection.commit(); // Commit transaction

        const [results] = await connection.execute(
          'SELECT COUNT(*) as count FROM TAMALAP'
        );
        if (!results) throw new Error('No results found.');
        // Return number of rows in TAMALAP table only
        return results[0].count;
      } catch (error) {
        await connection.rollback(); // Rollback transaction if error
        console.log(
          'Error executing query (TAMALA_KATEGTAM_EUHOZZAR):',
          error.message
        );
      }
      break;
    default:
      console.log('No query defined for this table.');
      return;
  }
  // console.log(valuesToInsert);
  // console.log(insertionColumns);
  const insertQuery = `INSERT INTO ${name} ${insertionColumns} VALUES ${valuesToInsert}`;
  const countQuery = `SELECT COUNT(*) as count FROM ${name}`;
  try {
    await pool.execute(insertQuery);
    const [results] = await pool.execute(countQuery);
    if (!results) throw new Error('No results found.');
    return results[0].count;
  } catch (error) {
    console.log('Error executing query:', error.message);
  }
};
