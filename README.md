# Database Engineering Notes

## Contents

- [Database Engineering Notes](#database-engineering-notes)
  - [Contents](#contents)
  - [ACID - Atomicity, Consistency, Integrity, Durability](#acid---atomicity-consistency-integrity-durability)
    - [A Transaction](#a-transaction)
      - [Transaction Lifespan](#transaction-lifespan)
      - [Nature of Transactions](#nature-of-transactions)

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

#### Transaction Lifespan

A transaction always begins with the keyword `BEGIN`. This lets the DB know that a transaction with multiple queries is about to start.

Once the transaction has fully run, its changes should be made durable in the DB, i.e., a transaction `COMMIT` occurs.

In case we wish to undo the effect of a transaction, we perform a transaction `ROLLBACK`. This will also be needed in case the transaction ends unexpectedly, such as a crash.

#### Nature of Transactions

