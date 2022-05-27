DROP TABLE IF EXISTS Log;

CREATE TABLE Log (
  dateAndTime varchar(255),
  nature varchar(255),
  playerID varchar(255),
  unixTime int
);