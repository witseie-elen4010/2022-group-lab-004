## Database and Environmental Variables

## Context

To store user details and scores a, persistent storage will be required. It is also essential to hide the credentials of the database for
security reasons and prevention of private data been accessed.

## Decision

Microsoft SQL server will be used as the data storage.Data stored will include user details, log actions and scores
Database design will be as follows:
 
User Table
 
|  Details                 |  Variable Type   | Constraints         |
| -----------              | ---------------- | ------------------- |
|  Username (Primary key)  |       Char       | not null and unique |
|   Email                  |       Char       | not null and unique |
|   Password               |       Char       | not null            |

Score Table

| Details   | Variable Type  | Constraints |
| --------- | -------------- | ----------- |
|    ID     |      Char      | not null    |
|    Score  |       Int      | not null    |

Log Table

| Details                | Variable Type    | Constraints |
| --------               | ---------------- | ----------- |
| Date and Time          |      Char        | not null    |
| Nature of action       |      Char        | not null    |
| Player Id              |      Char        | not null    |
| Unix Time              |      Int         | not null    |

Database credentials will be stored as environmental variables and be accessed on a repo using 'process.env.AzureDBAdmin' and 'process.env.AzureDBPassword' for
the username and password respectively.

## Status: Accepted

## Consequences

* Using a popular cloud storage will prevent any virus,cyber theft and other online threats from harming the data.
* Storing database credentials in the environmental variables will prevent any sensitive information been accessed on the repo

