// TODO: dokumentumok tábla? (gyogysz tábla foreign key - kihagytam)
// ( FOREIGN KEY (DOKUMENT_ID) REFERENCES DOKUMENTUMOK(ID), )

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'testpupha',
  password: process.env.DB_PASSWORD,
});

const tables = [
  `CREATE TABLE IF NOT EXISTS ATCKONYV (
        ATC VARCHAR(7) PRIMARY KEY NOT NULL,
        MEGNEV VARCHAR(250),
        ANGOL VARCHAR(250),
        HATOANYAG VARCHAR(250)
    )`,
  `CREATE TABLE IF NOT EXISTS ISOKONYV (
        ISO VARCHAR(15) PRIMARY KEY NOT NULL,
        MEGNEVEZES VARCHAR(250)
    )`,
  `CREATE TABLE IF NOT EXISTS NICHE (
        ID INT PRIMARY KEY NOT NULL,
        EGYEN_ID INT,
        LEIRAS VARCHAR(250) NOT NULL
    )`,
  `CREATE TABLE IF NOT EXISTS KIINTOR (
        ID INT PRIMARY KEY NOT NULL,
        JAROFEKVO VARCHAR(20),
        MEGYE VARCHAR(100),
        INTKOD VARCHAR(20),
        INTEZET VARCHAR(250),
        GYFKOD VARCHAR(20),
        EGYSEG VARCHAR(250),
        ORVOSNEV VARCHAR(128),
        PECSETKOD VARCHAR(6)
    )`,
  `CREATE TABLE IF NOT EXISTS BNOKODOK (
        ID INT PRIMARY KEY NOT NULL,
        KOD VARCHAR(32) NOT NULL,
        LEIRAS VARCHAR(4000),
        INDEX IDX_BNOKODOKKOD (KOD)
    )`,
  `CREATE TABLE IF NOT EXISTS SZAKVKODOK (
        ID INT PRIMARY KEY NOT NULL,
        KOD INT NOT NULL,
        LEIRAS VARCHAR(250) NOT NULL,
        MEGFELEL INT
    )`,
  `CREATE TABLE IF NOT EXISTS ORVOSOK (
        PECSETKOD VARCHAR(6) NOT NULL,
        SZAKV_ID INT NOT NULL,
        KEZDET DATE NOT NULL,
        VEGE DATE,
        FOREIGN KEY (SZAKV_ID) REFERENCES SZAKVKODOK(ID),
        PRIMARY KEY (PECSETKOD, SZAKV_ID, KEZDET)
    )`,
  `CREATE TABLE IF NOT EXISTS GYOGYSZ (
        ID INT PRIMARY KEY,
        KOZHID INT,
        OEP_DAT VARCHAR(8) NOT NULL,
        SWITCH VARCHAR(1) NOT NULL,
        TIPUS VARCHAR(1),
        OEP_TTT VARCHAR(9) NOT NULL,
        OEP_EAN VARCHAR(13),
        OEP_TK VARCHAR(64),
        TKTORLES VARCHAR(2),
        TKTORLESDAT DATE,
        OEP_NEV VARCHAR(255) NOT NULL,
        OEP_KSZ VARCHAR(255),
        OEP_ATC VARCHAR(7),
        HATOANYAG VARCHAR(128),
        ADAGMOD VARCHAR(32),
        ID_GYFORMA INT,
        GYFORMA VARCHAR(100),
        RENDELHET VARCHAR(3),
        EGYENID INT,
        POTENCIA VARCHAR(64),
        OHATO_MENNY INT,
        HATO_MENNY INT,
        HATO_EGYS VARCHAR(50),
        KISZ_MENNY INT,
        KISZ_EGYS VARCHAR(50),
        DDD_MENNY INT,
        DDD_EGYS VARCHAR(50),
        DDD_FAKTOR INT,
        DOT INT,
        OEP_TAR INT NOT NULL,
        OEP_NKAR INT NOT NULL,
        OEP_FAN INT NOT NULL,
        OEP_FAB INT NOT NULL,
        OEP_AFA VARCHAR(2),
        MAX_AR INT,
        NTK INT,
        OEP_ITM VARCHAR(3) NOT NULL,
        OEP_JC1 VARCHAR(1),
        OEP_JC2 VARCHAR(1),
        OEP_JC3 VARCHAR(1),
        OEP_JC4 VARCHAR(1),
        OEP_JC5 VARCHAR(1),
        KGYKERET INT,
        EGYSEGAR INT,
        NORM_TIP VARCHAR(16),
        NORM_SZAZ INT,
        NORM_FIXID INT,
        NORM_REFNTK INT,
        OEP_INN INT NOT NULL,
        OEP_INB INT NOT NULL,
        NORM_TERDIJ INT,
        NTK_TD INT,
        NORM_MIHAID INT,
        NORM_MIHACEL INT,
        NORM_MIHASTAT INT,
        NORM_KIHI VARCHAR(10),
        NORM_FELME VARCHAR(10),
        EUEM_TIP VARCHAR(16),
        EUEM_SZAZ INT,
        EUEM_FIXID INT,
        EUEM_REFNTK INT,
        OEP_EUN INT NOT NULL,
        OEP_EUB INT NOT NULL,
        EUEM_TERDIJ INT,
        NTK_EETD INT,
        EUEM_PONTOK VARCHAR(128),
        EUEM_KIHI VARCHAR(10),
        EUEM_FELME VARCHAR(10),
        EUKIEM_TIP VARCHAR(16),
        EUKIEM_SZAZ INT,
        EUKIEM_FIXID INT,
        EUKIEM_REFNTK INT,
        OEP_EU100N INT NOT NULL,
        OEP_EU100B INT NOT NULL,
        EUKIEM_TERDIJ INT,
        NTK_EKTD INT,
        EUKIEM_PONTOK VARCHAR(128),
        EUKIEM_KIHI VARCHAR(10),
        EUKIEM_FELME VARCHAR(10),
        FORGALOMBAN INT,
        BESOROLAS INT,
        PATIKA VARCHAR(1),
        EGYEDI VARCHAR(1),
        OEP_ISO VARCHAR(15),
        FORGENGT VARCHAR(128),
        FORGENGT_ID INT,
        FORGALMAZ VARCHAR(128),
        FORGALMAZ_ID INT,
        BRANDNEV VARCHAR(128),
        BRAND_ID INT,
        KERESZTJELZES VARCHAR(32),
        VEGE DATE,
        REGI_NEV VARCHAR(255),
        DOKUMENT_ID INT,
        PRAS_TERMEK INT,
        NICHE_ID INT,
        ADAG_MENNY INT,
        ADAG_EGYS VARCHAR(50),
        KEST_TERM INT,
        FOREIGN KEY (NICHE_ID) REFERENCES NICHE(ID),
        INDEX IDX_GYOGYSZ_BRANDID (BRAND_ID),
        INDEX IDX_GYOGYSZ_ITM (OEP_ITM),
        INDEX IDX_GYOGYSZ_TIPUS (TIPUS),
        INDEX IDX_TTTDAT (OEP_DAT, OEP_TTT)
    )`,
  `CREATE TABLE IF NOT EXISTS EUPONTOK (
        ID INT PRIMARY KEY NOT NULL,
        EUTIP VARCHAR(32) NOT NULL,
        KODSZAM INT,
        PERJEL VARCHAR(32),
        LEIRAS VARCHAR(4000),
        IND_TIP VARCHAR(1) NOT NULL,
        FELIRAS VARCHAR(4000),
        MEGJEGYZES VARCHAR(4000),
        FELIRORV INT NOT NULL,
        JIDOKORLAT INT NOT NULL,
        JAVASLATRA INT NOT NULL,
        INDEX IDX_EUIPONTKODPER (KODSZAM, PERJEL)
    )`,
  `CREATE TABLE IF NOT EXISTS EUINDIKACIOK (
        ID INT PRIMARY KEY NOT NULL,
        EUPONT_ID INT NOT NULL,
        NDX INT,
        LEIRAS VARCHAR(4000),
        FOREIGN KEY (EUPONT_ID) REFERENCES EUPONTOK(ID),
        INDEX IDX_EUINDIKACIOKUQ (EUPONT_ID, NDX)
    )`,
  `CREATE TABLE IF NOT EXISTS EUHOZZAR (
        EUPONT_ID INT NOT NULL,
        GYOGYSZ_ID INT NOT NULL,
        OFFLABEL INT NOT NULL,
        PRIMARY KEY (EUPONT_ID, GYOGYSZ_ID),
        FOREIGN KEY (EUPONT_ID) REFERENCES EUPONTOK(ID),
        FOREIGN KEY (GYOGYSZ_ID) REFERENCES GYOGYSZ(ID)
    )`,
  `CREATE TABLE IF NOT EXISTS BNOHOZZAR (
        EUPONT_ID INT NOT NULL,
        BNO_ID INT NOT NULL,
        GENKEY VARCHAR(5),
        PRIMARY KEY (EUPONT_ID, BNO_ID),
        FOREIGN KEY (EUPONT_ID) REFERENCES EUPONTOK(ID),
        FOREIGN KEY (BNO_ID) REFERENCES BNOKODOK(ID),
        INDEX IDX_BNOHOZZARBNOID (BNO_ID),
        INDEX IDX_BNOHOZZAREUID (EUPONT_ID)
    )`,
  `CREATE TABLE IF NOT EXISTS EUJOGHOZZAR (
        EUPONT_ID INT NOT NULL,
        KATEGORIA_ID INT NOT NULL,
        KATEGORIA VARCHAR(64),
        JOGOSULT_ID INT,
        JOGOSULT VARCHAR(64) NOT NULL,
        JIDOKORLAT INT NOT NULL,
        SZAKV_ID INT NOT NULL,
        KIINT_ID INT NOT NULL,
        FOREIGN KEY (KIINT_ID) REFERENCES KIINTOR(ID),
        FOREIGN KEY (EUPONT_ID) REFERENCES EUPONTOK(ID),
        FOREIGN KEY (SZAKV_ID) REFERENCES SZAKVKODOK(ID),
        INDEX IDX_EUJOGHOZZAR (EUPONT_ID, KATEGORIA_ID, JOGOSULT_ID, SZAKV_ID),
        INDEX IDX_EUJOGHOZZAR_KIINT (KIINT_ID)
    )`,
  `CREATE TABLE IF NOT EXISTS VERZIOK (
        KIHIRD VARCHAR(8) NOT NULL,
        VERZIO INT NOT NULL,
        TIPUS INT NOT NULL,
        STATUS INT NOT NULL,
        JAVAUTH VARCHAR(64),
        JAVDAT DATE,
        ID INT PRIMARY KEY NOT NULL,
        INDEX IDX_VERZIOKUNIQ (KIHIRD, VERZIO, TIPUS)
    )`,
];

export const createDatabase = async () => {
  try {
    for (const table of tables) {
      await pool.execute(table);
    }
    console.log('Database created.');
    await pool.end();
  } catch (error) {
    console.error('Query error:', error);
    await pool.end();
  }
};

createDatabase();
