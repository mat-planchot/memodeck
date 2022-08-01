#!/bin/bash

mysql << EOF
  CREATE DATABASE IF NOT EXISTS $DB_DATABASE;   
  USE $DB_DATABASE; 

  CREATE TABLE IF NOT EXISTS user 
    ( 
      iduser        INT PRIMARY KEY auto_increment, 
      username      VARCHAR(50) UNIQUE NOT NULL, 
      email         VARCHAR(100) UNIQUE NOT NULL, 
      password      CHAR(60) NOT NULL,
      role          ENUM('Admin', 'SuperUser', 'Professeur', 'Apprenant') DEFAULT 'Apprenant'
    ); 

  CREATE TABLE IF NOT EXISTS deck
    ( 
      iddeck        INT PRIMARY KEY auto_increment, 
      deckname      VARCHAR(25) NOT NULL, 
      fkuser        INT NOT NULL,
      FOREIGN KEY (fkuser) REFERENCES user(iduser) ON DELETE CASCADE
    ); 

  CREATE TABLE IF NOT EXISTS card
    ( 
      idcard        INT PRIMARY KEY auto_increment, 
      front         TEXT NOT NULL,
      back          TEXT NOT NULL,
      frontmedia    TEXT,
      backmedia     TEXT,
      fkdeck        INT NOT NULL,
      nbreview      INT NOT NULL DEFAULT 1,
      issuspended   BOOLEAN NOT NULL DEFAULT 0,
      difficulty    FLOAT(6,2) NOT NULL DEFAULT 1,
      nbdayreview   INT NOT NULL DEFAULT 1,
      reviewdate    DATE DEFAULT NULL,
      FOREIGN KEY (fkdeck) REFERENCES deck(iddeck) ON DELETE CASCADE
    );
EOF
