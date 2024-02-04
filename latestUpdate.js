import {pool} from './pool.js';

const [results] = await pool.execute(`SELECT MAX(ERV_DATUM) AS latest FROM KIHIRDETES`);
const iso = results[0].latest;
const date = new Date(iso);
date.setDate(date.getDate() + 1);
export const latestUpdate = date.toISOString().split('T')[0];