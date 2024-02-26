// const exampleData = [
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
  ////////////////////////////////
  //   Unique queries based on table name
  let valuesToInsert, insertionColumns;
  switch (name) {
    case 'ATCKONYV':
      valuesToInsert = responseData
        .map(
          row =>
            `(${Object.values(row)
              .map(value => `'${value}'`)
              .join(', ')})`
        )
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'BNOKODOK':
      valuesToInsert = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          newValues.push(parseInt(values[0]));
          newValues.push(`'${values[1].replace(/'/g, "''")}'`); // escape single quotes in string
          newValues.push(`'${values[2].replace(/'/g, "''")}'`); // escape single quotes in string
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'NICHE':
      valuesToInsert = responseData
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
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'ISOKONYV':
      valuesToInsert = responseData
        .map(row => {
          const filteredValues = Object.values(row).filter(
            value => value !== '-/-' && value !== ''
          );
          const sqlValues = filteredValues.map(value => `'${value}'`);
          return `(${sqlValues.join(', ')})`;
        })
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'BRAND':
      valuesToInsert = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          newValues.push(parseInt(values[0]));
          newValues.push(`'${values[1].replace(/'/g, "''")}'`); // escape single quotes in string
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'CEGEK':
      valuesToInsert = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          const [ERV_KEZD, ERV_VEGE] = values[2].split('-');
          newValues.push(parseInt(values[0]));
          newValues.push(`'${values[1].replace(/'/g, "''")}'`); // escape single quotes in string
          newValues.push(`'${ERV_KEZD}'`);
          newValues.push(`'${ERV_VEGE}'`);
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'KIINTOR':
      valuesToInsert = responseData
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
      insertionColumns = `(${columns.join(', ')})`;
      break;
    case 'SZAKVKODOK':
      valuesToInsert = responseData
        .map(row => {
          const values = Object.values(row);
          let newValues = [];
          newValues.push(parseInt(values[0]));
          newValues.push(`'${values[1]}'`);
          newValues.push(parseInt(values[2]) || 0);
          return `(${newValues.join(', ')})`;
        })
        .join(', ');
      insertionColumns = `(${columns.join(', ')})`;
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
      valuesToInsert = insertValues.join(', ');
      insertionColumns = `(PECSETKOD, SZAKV_ID)`;
      break;
    default:
      console.log('No query defined for this table.');
      return;
  }
    // console.log(insertionColumns);
    // console.log(valuesToInsert);
  const insertQuery = `INSERT INTO ${name} ${insertionColumns} VALUES ${valuesToInsert}`;
  const countQuery = `SELECT COUNT(*) as count FROM ${name}`;
  ////////////////////////////////
  try {
    await pool.execute(insertQuery);
    const [results] = await pool.execute(countQuery);
    if (!results) {
      throw new Error(`No results found.`);
    }
    // console.log(results[0].count);
    return results[0].count;
  } catch (error) {
    console.log('Error executing query:', error.message);
    throw error;
  }
};
