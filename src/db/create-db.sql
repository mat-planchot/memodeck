DROP DATABASE IF EXISTS epsi;   
CREATE DATABASE IF NOT EXISTS epsi;   
USE epsi; 

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
    fkuser        INT,
    FOREIGN KEY (fkuser) REFERENCES user(iduser)
  ); 

DROP TABLE IF EXISTS card;

CREATE TABLE IF NOT EXISTS card
  ( 
    idcard        INT PRIMARY KEY auto_increment, 
    front         TEXT NOT NULL,
    back          TEXT NOT NULL,
    frontmedia   VARCHAR(255),
    backmedia    VARCHAR(255),
    fkdeck        INT,
    FOREIGN KEY (fkdeck) REFERENCES deck(iddeck)
  );

DROP TABLE IF EXISTS reviewcard;

CREATE TABLE IF NOT EXISTS reviewcard
  ( 
    idreviewcard  INT PRIMARY KEY auto_increment,
    nbreview      INT NOT NULL DEFAULT 1,
    issuspended   BOOLEAN NOT NULL DEFAULT 0,
    difficulty    INT NOT NULL DEFAULT 0,
    previousdate  DATE,
    reviewdate    DATE NOT NULL,
    fkcard        INT,
    FOREIGN KEY (fkcard) REFERENCES card(idcard)
  );

