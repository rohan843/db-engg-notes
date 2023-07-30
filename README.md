# Database Engineering Notes

## Contents

- [Database Engineering Notes](#database-engineering-notes)
  - [Contents](#contents)
  - [ACID - Atomicity, Consistency, Integrity, Durability](#acid---atomicity-consistency-integrity-durability)
    - [A Transaction](#a-transaction)

## ACID - Atomicity, Consistency, Integrity, Durability

### A Transaction

At its core, a transaction is a collection of SQL queries that are treated as **1 unit of work**.

SQL assumes a relational database, with tables. In such a system, our single logical piece of work would be split up in different queries and executed as a single unit.

E.g., money transfer from account A to B:

``` sql
SELECT Account A balance  -- see if enough money present
UPDATE Account A balance  -- deduct money
UPDATE Account B balance  -- add money
```

