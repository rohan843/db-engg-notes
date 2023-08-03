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
        - [Lost Updates](#lost-updates)
      - [Isolation Levels](#isolation-levels)
        - [Read Uncommitted](#read-uncommitted)
        - [Read Committed](#read-committed)
        - [Repeatable Read](#repeatable-read)
        - [Snapshot](#snapshot)
        - [Serializable](#serializable)
        - [Summary](#summary)
      - [Database Implementation of Isolation](#database-implementation-of-isolation)
    - [Consistency](#consistency)
    - [Durability](#durability)
      - [WAL - Write Ahead Log](#wal---write-ahead-log)
      - [The issue of OS Cache](#the-issue-of-os-cache)

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

Databases use a variety of methods to tackle this problem. Postgres creates a new version of any row post updation, so that other transactions can use the previous version. This is fast but more storage is needed. In contrast, MySQL and others have an undo stack that stores the delta changes in data values. This stack provides the older value, but is time consuming.

##### Phantom Reads

This refers to the situation where the value to be read _doesn't_ exist yet. In such a case, along the course of a single transaction, if the value is accessed first but it didn't exist, another access to that value (when the value does exist) would give different results.

Consider the case where we perform some query on data within a certain range (say based on timestamp). If this range of data is accessed again within the same transaction, but some new records have been inserted (committed by some concurrent transaction), the queried data will be different the second time, even though the range was same. This may cause errors in the transaction.

Note: This looks similar to non-repeatable reads, in that a value is 'read' twice, but is actually different because in this case, the value being 'read' didn't exist the first time. The difference comes down to the implementation. In the case of non-repeatable reads, a transaction can obtain a lock on the data it reads, but in the case of phantom reads, a transaction can't really get a lock corresponding to data that doesn't even exist yet.

This _can_ be solved by obtaining a lock on the entire table. This would also stop all other read phenomena, but at the expense of effectively serializing the transactions. The throughput would decrease, latency would increase, and concurrency would vanish.

##### Lost Updates

This is phenomenon where a transaction writes some value, but on reading that value afterwards, it is different from the value that was written. In effect, the write (i.e., update) to the value is lost.

This can be caused if a transaction wrote to a value, but another concurrent transaction also wrote to it, and modified it.

This can be solved via row - level locks. We can lock the rows we modified.

#### Isolation Levels

These have been invented to fix the read phenomena.

##### Read Uncommitted

This is the weakest isolation level. It does not provide any isolation. Any change, committed or uncommitted, done by other transactions, is visible to the current transaction.

- Pros:
  - typically fast (less overhead).
- Cons:
  - Dirty reads are possible.

##### Read Committed

This is one of the most popular isolation levels, and is optimized for in various DB engines. Each query in a transaction only sees committed changes done by other transactions.

This is often the default level.

- Pros:
  - Prevents dirty reads.
- Cons:
  - Non-repeatable and phantom reads are possible.

##### Repeatable Read

This fixes the non-repeatable read problem. The transaction will make sure that when a query reads a row, that row will remain unchanged while its running.

_Once a row is read, only then will there be a guarantee of its value being unchanged._ This means other (non-read) rows can still change.

- Pros:
  - Prevents non-repeatable reads.
- Cons:
  - Phantom reads are possible.
  - An extra overhead is incurred.

##### Snapshot

Each query in a transaction only sees changes that have been committed up to the start of the transaction. It's like a snapshot version of the database at that moment.

This will eliminate _every_ read phenomenon.

> In postgres, the repeatable read level is essentially snapshot level. It creates versions of rows based on timestamps, and a transaction only has access to the version corresponding to its `BEGIN` timestamp.

- Pros:
  - Prevents all read phenomena.
- Cons:
  - An extra overhead is incurred.

##### Serializable

Transactions are run as if they are serialized after one another. There is no concurrency anymore.

##### Summary

| Isolation Level                          | Dirty reads | Lost updates | Non-repeatable reads | Phantoms    |
| ---------------------------------------- | ----------- | ------------ | -------------------- | ----------- |
| Read Uncommitted                         | may occur   | may occur    | may occur            | may occur   |
| Read Committed                           | don't occur | may occur    | may occur            | may occur   |
| Repeatable Read                          | don't occur | don't occur  | don't occur          | may occur   |
| Snapshot (and Postgres' Repeatable Read) | don't occur | don't occur  | don't occur          | don't occur |
| Serializable                             | don't occur | don't occur  | don't occur          | don't occur |

#### Database Implementation of Isolation

Each DBMS implements isolation levels differently.

Pessimistic ways: using row-level locks, table locks, and page locks to avoid lost updates.

Optimistic ways: no locks are put in place. The DB tracks if things changed, and if they did change, the transaction is failed, and must be retried by the user. (This is typically a `SerializableError`, usually seen in NoSQL DBs as well.)

Repeatable read 'locks' the rows it reads but it could be expensive if a lot of rows are read.

Serializable is usually implemented with optimistic concurrency control. It can also be implemented pessimistically with `SELECT FOR UPDATE` clause (that locks the selected rows).

### Consistency

There are 2 kinds of consistencies:

1. Consistency in data: Is the persisted data (in disk) consistent with the data model we have?
2. Consistency in reads: If a transaction committed a change, will a new transaction immediately see the change?
   - This may happen if a change to the database doesn't immediately get written back to replicas.
   - This affects the system as a whole.
   - Relational and NoSQL databases suffer from this.
   - Is gets repaired by eventual consistency.

It is defined by the user (typically the DBA) who defines the data model.

Most of the time, it is about enforcing referential integrity (foreign keys).

Atomicity and isolation also facilitate consistency.

_Corrupted data, i.e., data that will not become consistent eventually, is a very serious issue._

### Durability

It is the process of persisting the writes that clients make to the database in a non-volatile storage system.

This is a slow process, so many databases integrate this in different ways. Redis, for example, writes to memory, and then persists the memory contents to disk in the background.

The basic idea is that changes made by committed transactions must be persisted in a durable, non-volatile storage.

> In simple terms, durability means that once a transaction commits, we can shut down the power right at that moment. The data should still be in the database.

There are many durability techniques:
1. WAL - Write Ahead Log: Any changes (deltas) are immediately written to the WAL, which is stored on disk. This is quicker than actually updating the DB data structures.
   - In case of a crash, the data can be re-built using the WAL.
2. Asynchronous Snapshot: As we write, we keep all changes in memory, but in the background, we write all changes to disk, at once.
3. AOF - Append Only File: Similar to WAL, for keeping logs of changes, in the disk.

The idea is to write data persistently in a quick way, and also a durable way (in case data is lost, it can be re-computed).

#### WAL - Write Ahead Log

Writing a lot of data to disk is expensive (indexes, data files, columns, rows, etc.). So, DBMSs persist a compressed version of the changes, known as write-ahead-log segments.

#### The issue of OS Cache

A `write` request in OS usually goes to the OS cache, which is in-memory. The reason is that OS'es batch the writes and then collectively flush them to disk, for performance reasons.

In such a scenario, an OS crash and a machine restart could lead to loss of data.

The issue is that from the DB's perspective, the OS wrote the WAL segment to disk, and the DB can then report the transaction as having been committed, but the change could be lost untill the OS cache has been flushed to disk. This effect makes a DB no longer durable.

Becuase DB systems need guaranteed durability, they use the `fsync` command to force the cache to be flushed. This ensures that the data is written to disk, but it makes commits very slow. So, there is a tradeoff between durability and speed.
