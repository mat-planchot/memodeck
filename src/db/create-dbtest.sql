DROP DATABASE IF EXISTS epsitest;   
CREATE DATABASE IF NOT EXISTS epsitest;   
USE epsitest; 

DROP TABLE IF EXISTS user;

CREATE TABLE IF NOT EXISTS user 
  ( 
    iduser        INT PRIMARY KEY auto_increment, 
    username      VARCHAR(50) UNIQUE NOT NULL, 
    email         VARCHAR(100) UNIQUE NOT NULL, 
    password      CHAR(60) NOT NULL,
    role          ENUM('Admin', 'SuperUser', 'Professeur', 'Apprenant') DEFAULT 'Apprenant'
  ); 

DROP TABLE IF EXISTS deck;

CREATE TABLE IF NOT EXISTS deck
  ( 
    iddeck        INT PRIMARY KEY auto_increment, 
    deckname      VARCHAR(25) UNIQUE NOT NULL, 
    fkuser        INT NOT NULL,
    FOREIGN KEY (fkuser) REFERENCES user(iduser)
  ); 

DROP TABLE IF EXISTS card;

CREATE TABLE IF NOT EXISTS card
  ( 
    idcard        INT PRIMARY KEY auto_increment, 
    front         TEXT NOT NULL,
    back          TEXT NOT NULL,
    frontmedia    TEXT,
    backmedia     TEXT,
    fkdeck        INT NOT NULL,
    FOREIGN KEY (fkdeck) REFERENCES deck(iddeck)
  );

DROP TABLE IF EXISTS reviewcard;

CREATE TABLE IF NOT EXISTS reviewcard
  ( 
    idreviewcard  INT PRIMARY KEY auto_increment,
    nbreview      INT NOT NULL DEFAULT 1,
    issuspended   BOOLEAN NOT NULL DEFAULT 0,
    difficulty    FLOAT(6,2) NOT NULL DEFAULT 1,
    nbdayreview   INT NOT NULL DEFAULT 1,
    reviewdate    DATE NOT NULL,
    fkcard        INT NOT NULL,
    FOREIGN KEY (fkcard) REFERENCES card(idcard)
  );
