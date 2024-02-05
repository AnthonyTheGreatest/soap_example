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
        const elements = Object.entries(row); // Object.prototype.entries()
        let newValues = [];
        elements.forEach(([key, value]) => {
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
        });
        return `(${newValues.join(', ')})`;
      });
      insertionColumns = `(${columns.join(', ')})`;
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
