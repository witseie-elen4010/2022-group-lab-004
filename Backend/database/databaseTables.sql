-- creating Database Tables to store information 

DROP TABLE IF EXISTS Users;

CREATE TABLE Users (

username varchar(255) NOT NULL UNIQUE,
email varchar(255) NOT NULL UNIQUE,
password varchar(255) NOT NULL,
PRIMARY KEY (Username)
);

