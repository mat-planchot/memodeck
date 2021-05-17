DROP DATABASE IF EXISTS epsi;   
CREATE DATABASE IF NOT EXISTS epsi;   
USE epsi; 

DROP TABLE IF EXISTS user; 

CREATE TABLE IF NOT EXISTS user 
  ( 
     id         INT PRIMARY KEY auto_increment, 
     email      VARCHAR(100) UNIQUE NOT NULL, 
     password   CHAR(60) NOT NULL, 
     role       ENUM('Professeur', 'Apprenant') DEFAULT 'Apprenant'
  ); 