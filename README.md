# Database Engineering Notes

## Contents

- [Database Engineering Notes](#database-engineering-notes)
  - [Contents](#contents)
  - [ACID - Atomicity, Consistency, Integrity, Durability](#acid---atomicity-consistency-integrity-durability)
    - [A Transaction](#a-transaction)
      - [Transaction Lifespan](#transaction-lifespan)
      - [Nature of Transactions](#nature-of-transactions)
    - [Atomicity](#atomicity)
    - [Isolation](#isolation)
      - [Read Phenomena](#read-phenomena)
        - [Dirty Reads](#dirty-reads)
        - [Non - Repeatable Reads](#non---repeatable-reads)
        - [Phantom Reads](#phantom-reads)

## ACID - Atomicity, Consistency, Integrity, Durability

### A Transaction

At its core, a transaction is a collection of SQL queries that are treated as **1 unit of work**.

SQL assumes a relational database, with tables. In such a system, our single logical piece of work would be split up in different queries and executed as a single unit.

E.g., money transfer from account A to B:

```sql
SELECT Account A balance  -- see if enough money present
UPDATE Account A balance  -- deduct money
UPDATE Account B balance  -- add money
```

#### Transaction Lifespan

A transaction always begins with the keyword `BEGIN`. This lets the DB know that a transaction with multiple queries is about to start.

Once the transaction has fully run, its changes should be made durable in the DB, i.e., a transaction `COMMIT` occurs.

In case we wish to undo the effect of a transaction, we perform a transaction `ROLLBACK`. This will also be needed in case the transaction ends unexpectedly, such as a crash.

#### Nature of Transactions

Usually transactions are used to change or modify data, but we may also have a read-only transaction.

> If the DB knows a transaction is read - only, it can optimize its execution.

As an example of a read-only transaction, consider a case where we may want a report generated, for which we need a consistent snapshot based on the time of the transaction. (This would come under _isolation_ to ensure no other transactions affect the data.)

e.g.:
We want $100 sent from account 1 to 2:

```sql
BEGIN TX1

  SELECT balance FROM account WHERE id=1;
  CHECK balance > 100;
    UPDATE account SET balance = balance - 100 WHERE id=1;
    UPDATE account SET balance = balance + 100 WHERE id=2;

COMMIT TX1
```

> In case we simply run a SQL command without the transaction explicitly defined, the DB implicitly defines the transaction before running it.

### Atomicity

It is one of the 4 ACID properties that define an RDBMS, or any other DBMS in general.

It says that all queries in a transaction must succeed. If one query fails, all prior successful queries in the transaction should rollback. If the database went down prior to the commit of a transaction, all the successful queries in the transaction should rollback.

> This gives rise to a variety of implementations.
>
> Certain DB's are optimistic in nature, and write the results of queries to disk immediately after the execution of the query. This gives rise to slower query execution and slower rollbacks but almost instantaneous commits.
>
> Others write all changes to memory, leading to quick query execution and quick rollbacks, and then flush the memory contents to disk, that leads to slower commits.
>
> There is a tradeoff here.

In case the transaction fails mid way, the DB itself should roll back the transaction.

Rollbacks may take over an hour, and require high amounts of system resources. Therefore, it is typically suitable to write smaller transactions, with lesser queries.

### Isolation

A standard DB would have multiple TCP connections to it. This means that many transactions may be running concurrently.

In such a scenario, the question to ask is _can an inflight transaction see changes made by other transactions?_

At times, concurrency gives rise to various **read phenomena**. These are mostly undesirable, and also difficult to debug. To resolve them, we have the concept of **isolation levels**.

#### Read Phenomena

##### Dirty Reads

This is said to occur if a transaction reads some value that has been modified by another transaction, but the other transaction has been committed yet.

Now, there is a chance that this change may get rolled back.

> `Dirty` means something that has been modified, but not flushed yet, i.e., not written to disk yet.

##### Non - Repeatable Reads

Consider the case where a transaction reads the same value twice (e.g., a `SELECT` query to get 1 record, followed by a `SELECT SUM` query, that results in the same record being read again, internally).

A non-repeatable read is said to occur when a value is read by a transaction twice, but the value is different the second time.

> Say we read a value `X` that was equal to 3, but then if we read `X` again, _without_ changing it, we might get the value 17. This is a non-repeatable read.

##### Phantom Reads

This refers to the situation where the value to be read _doesn't_ exist yet. In such a case, along the course of a single transaction, if the value is accessed first but it didn't exist, another access to that value (when the value does exist) would give different results.

Consider the case where we perform some query on data within a certain range (say based on timestamp). If this range of data is accessed again within the same transaction, but some new records have been inserted (by some concurrent transaction), the queried data will be different the second time, even though the range was same. This may cause errors in the transaction.

Note: This looks similar to non-repeatable reads, in that a value is 'read' twice, but is actually different because in this case, the value being 'read' didn't exist the first time.

