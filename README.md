# Database Engineering Notes

## Contents

- [Database Engineering Notes](#database-engineering-notes)
  - [Contents](#contents)
  - [Notes](#notes)
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
        - [Comparison of Serializable and Repeatable Read Isolation Levels](#comparison-of-serializable-and-repeatable-read-isolation-levels)
      - [Database Implementation of Isolation](#database-implementation-of-isolation)
    - [Consistency](#consistency)
      - [Eventual Consistency](#eventual-consistency)
    - [Durability](#durability)
      - [WAL - Write Ahead Log](#wal---write-ahead-log)
      - [The issue of OS Cache](#the-issue-of-os-cache)
  - [Database Internals](#database-internals)
    - [How Tables and Indexes Stored on Disk](#how-tables-and-indexes-stored-on-disk)
      - [Notes](#notes-1)
    - [Row vs. Column Oriented Databases](#row-vs-column-oriented-databases)
      - [Row Oriented Databases (Row Store)](#row-oriented-databases-row-store)
      - [Column Oriented Databases (Column Store)](#column-oriented-databases-column-store)
      - [Compairing Row and Column Stores](#compairing-row-and-column-stores)
    - [Primary Key vs Secondary Key](#primary-key-vs-secondary-key)
    - [Databases Pages](#databases-pages)
      - [PostgreSQL Page Layout](#postgresql-page-layout)
  - [Database Indexing](#database-indexing)
    - [`Explain` Command in Postgres](#explain-command-in-postgres)
    - [Various kinds of Scans Done by DBs](#various-kinds-of-scans-done-by-dbs)
      - [Seq Scan](#seq-scan)
      - [Index Scan](#index-scan)
      - [Bitmap Scan](#bitmap-scan)
    - [Key vs. Non - Key Column Indexes](#key-vs-non---key-column-indexes)
    - [Index Scan vs. Index Only Scan](#index-scan-vs-index-only-scan)
    - [Combining DB Indexes](#combining-db-indexes)
    - [How DB Optimizers Decide to Use Indexes](#how-db-optimizers-decide-to-use-indexes)
      - [Database Hinting](#database-hinting)
    - [Concurrent creation of an index on a production table (avoiding blocking of table writes)](#concurrent-creation-of-an-index-on-a-production-table-avoiding-blocking-of-table-writes)
    - [Bloom Filters - Quick Lookup for Absence of Values](#bloom-filters---quick-lookup-for-absence-of-values)
    - [Working with Billion Row Tables (Large Tables)](#working-with-billion-row-tables-large-tables)
    - [The Cost of Long Running Transactions](#the-cost-of-long-running-transactions)
    - [Microsoft SQL Server Clustered Index Design](#microsoft-sql-server-clustered-index-design)
      - [Clustered Index Architecture](#clustered-index-architecture)
      - [Nonclustered Index Architecture](#nonclustered-index-architecture)
  - [B-Tree vs. B+-Tree in Production DB Systems](#b-tree-vs-b-tree-in-production-db-systems)
    - [The Problem: Full Table Scans](#the-problem-full-table-scans)
    - [Original B-Trees](#original-b-trees)
    - [Performance Enhancement by Original B-Trees](#performance-enhancement-by-original-b-trees)
    - [Limitations of the Original B-Tree](#limitations-of-the-original-b-tree)
    - [B+-Trees](#b-trees)
    - [B+-Trees and DB Considerations](#b-trees-and-db-considerations)
    - [Storage Cost of B+-Trees in MySQL vs. Postgres](#storage-cost-of-b-trees-in-mysql-vs-postgres)
  - [Database Partitioning](#database-partitioning)
    - [Vertical vs. Horizontal Partitioning](#vertical-vs-horizontal-partitioning)
    - [Partitioning Types](#partitioning-types)
    - [Horizontal Partitioning vs. Sharding](#horizontal-partitioning-vs-sharding)
    - [Partitioning Demo](#partitioning-demo)
      - [Partition Pruning](#partition-pruning)
    - [Advantages of Partitioning](#advantages-of-partitioning)
    - [Disadvantages of Partitioning](#disadvantages-of-partitioning)
    - [Automating Partition Creation](#automating-partition-creation)
  - [Database Sharding](#database-sharding)
    - [Consistent Hashing](#consistent-hashing)
    - [Horizontal Partitioning vs. Sharding](#horizontal-partitioning-vs-sharding-1)
    - [Demo](#demo)
    - [Advantages of Sharding](#advantages-of-sharding)
    - [Disadvantages of Sharding](#disadvantages-of-sharding)
    - [When Should we Consider Sharding our Database](#when-should-we-consider-sharding-our-database)
      - [Case Study: Youtube DB Design Evolution](#case-study-youtube-db-design-evolution)
  - [Concurrency Control](#concurrency-control)
    - [Shared vs. Exclusive Locks](#shared-vs-exclusive-locks)
      - [Advantages](#advantages)
      - [Disadvantages](#disadvantages)
    - [Deadlocks](#deadlocks)
    - [Two - Phase Locking and The Double Booking Problem](#two---phase-locking-and-the-double-booking-problem)
    - [Alternative Solution to the Double Booking Problem \[Pitfall Warning\]](#alternative-solution-to-the-double-booking-problem-pitfall-warning)
  - [SQL Pagination Best Practice - Avoid `Offset`](#sql-pagination-best-practice---avoid-offset)
  - [Connection Pooling in DBs](#connection-pooling-in-dbs)
  - [Database Replication](#database-replication)
    - [Demo](#demo-1)
    - [Advantages and Disadvantages of Replication](#advantages-and-disadvantages-of-replication)
  - [Twitter Database System Design](#twitter-database-system-design)
  - [DB Engines \[aka Storage engines, Embedded Databases\]](#db-engines-aka-storage-engines-embedded-databases)
    - [MyISAM](#myisam)
    - [InnoDB](#innodb)
    - [XtraDB](#xtradb)
    - [SQLite](#sqlite)
    - [Aria](#aria)
    - [BerkeleyDB](#berkeleydb)
    - [LevelDB](#leveldb)
    - [RocksDB](#rocksdb)
    - [Demo - Using different DB engines in MySQL](#demo---using-different-db-engines-in-mysql)
  - [Database Cursors](#database-cursors)
    - [Advantages and Disadvantages](#advantages-and-disadvantages)
    - [Server side cursor vs. client side cursor](#server-side-cursor-vs-client-side-cursor)
  - [Homomorphic Encryption](#homomorphic-encryption)
  - [MongoDB Architecture](#mongodb-architecture)

## Notes

1. It is very important to always work inside the `begin transaction` and `end transaction` clauses, especially when working on a terminal in an interactive mode. This ensures we have the capability to rollback any changes we might have done, that weren't supposed to be done (such as if we forgot a `where` clause in an `update` query).

2. Ensure the primary key of a table has enough values to be able to accommodate every row. For example, if the primary key is a 4-Byte integer, it won't be able to accomodate more than ~2^32 rows.

3. Carefully plan the required sizes (data types) of all DB columns, especially the primary key columns, from a scalibility point of view. Larger than required sizes can slow down performance and increase DB size.

## ACID - Atomicity, Consistency, Integrity, Durability

### A Transaction

At its core, a transaction is a collection of SQL queries that are treated as **1 unit of work**.

SQL assumes a relational database, with tables. In such a system, our single logical piece of work would be split up in different queries and executed as a single unit.

E.g., money transfer from account A to B:

```sql
BEGIN
SELECT Account A balance  -- see if enough money present
UPDATE Account A balance  -- deduct money
UPDATE Account B balance  -- add money
COMMIT
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

This is said to occur if a transaction reads some value that has been modified by another transaction, but the other transaction hasn't been committed yet.

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
  - Prevents non-repeatable reads. (In postgres, prevents all read phenomena; See `Snapshot` level for that, below.)
- Cons:
  - Phantom reads are possible.
  - An extra overhead is incurred.

##### Snapshot

Each query in a transaction only sees changes that have been committed up to the start of the transaction. It's like a snapshot version of the database at that moment.

It is different from repeatable read as _even if a row is un-read but its value changed by another transaction's commit, the current transaction will still see the older value._

This will eliminate _every_ read phenomenon.

> In postgres, the repeatable read level is essentially snapshot level. It creates versions of rows based on timestamps, and a transaction only has access to the version corresponding to its `BEGIN` timestamp. This method is called **MVCC** (multi version concurrency control).

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

##### Comparison of Serializable and Repeatable Read Isolation Levels

Consider a table with a single column, `data`:

| data |
| :--: |
|  AA  |
|  BB  |

Now, consider a transaction `t1` that converts all `A`s to `B`s, and `t2`, that converts `B`s to `A`s.

Ideally, if we run both, we might be expecting an order `t1 -> t2`, i.e., our data is changed as:

After `t1`:

| data |
| :--: |
|  BB  |
|  BB  |

Then, after `t2`:

| data |
| :--: |
|  AA  |
|  AA  |

But, is `t1` and `t2` are concurrently executed, it is possible `t1` only reads the first row, and `t2` only reads the second row, giving an output of:

| data |
| :--: |
|  BB  |
|  AA  |

The rows have essentially been toggled, `A` -> `B` and vice verca.

An isolation level of serializable will ensure execution occurs in either `t1 -> t2` fasion, or `t2 -> t1`, and we'll either get all `A`s or all `B`s. Repeatable read however gives no such guarantee, and we might get the 'toggled' result as above.

In code,

consider a table `test` with the following structure:

| id  | t   |
| --- | --- |
| 1   | a   |
| 2   | b   |

```sql
-- first transaction
begin transaction isolation level repeatable read;
select * from test;
update test set t = 'b' where t = 'a';
commit;

-- second transaction, run CONCURRENTLY with the first
begin transaction isolation level repeatable read;
select * from test;
update test set t = 'a' where t = 'b';
commit;
```

After running the 2 above transactions concurrently (say both of them update first, only then both commit), each transaction is isolated from the other's changes. So, the first transaction sees the following table after the update:

| id  | t   |
| --- | --- |
| 1   | b   |
| 2   | b   |

And the second one sees:

| id  | t   |
| --- | --- |
| 1   | a   |
| 2   | a   |

But, once both do commit, the table's final state will be:

| id  | t   |
| --- | --- |
| 1   | b   |
| 2   | a   |

As only the modifications will be persisted, the rows the transactions didn't modify stay the same (and are modified by the other transaction).

On the other hand, if we execute the transactions at the serializable level,

```sql
-- first transaction
begin transaction isolation level serializable;
select * from test;
update test set t = 'b' where t = 'a';
commit;

-- second transaction, run CONCURRENTLY with the first
begin transaction isolation level serializable;
select * from test;
update test set t = 'a' where t = 'b';
commit;
```

Say both were executed concurrently, but the first transaction commits first. Now, when the second transaction commits, there will be an error and the second transaction will be rolled back. This is because both transactions read and write the same column `test.t`. This creates read/write dependencies that cannot be resolved and the transaction that committed when the non-serializability was identifird will have to be rolled back.

The rolled back transaction may be run again.

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
   - Relational and NoSQL databases suffer from this when we want to scale horizontally or introduce caching.
   - It gets repaired by eventual consistency.

It is defined by the user (typically the DBA) who defines the data model.

Most of the time, it is about enforcing referential integrity (foreign keys).

Atomicity, isolation and durability also facilitate consistency. We cannot have consistency if any one of these properties is missing.

_Corrupted data, i.e., data that will not become consistent eventually, is a very serious issue._ That is why, we need to be very careful about consistency in data. Consistency in reads will be solved by eventual consistency after some time, and is more prominent as we scale our DB system.

#### Eventual Consistency

This term emerged mainly as NoSQL databases became popular.

If our DBMS system has only a single server, any changes committed by some transaction will be immediately available to other transactions. However, to scale our system, we require multiple nodes, caches and so on. This means that changes done to some row may take some time before they propagate to the replicas of that row.

Say we have 3 Db servers: one master and 2 followers. If a value `X` is updated at the master to `Z`, it will take some time to propagate to the 2 follower nodes. Until the time that value doesn't propagate, our system is inconsistent, and will _eventually_ become consistent.

It should be analysed if this effect can be tolerable in our system.

### Durability

It is the process of persisting the writes that clients make to the database in a non-volatile storage system.

This is a slow process, so many databases integrate this in different ways. Redis, for example, writes to memory, and then persists the memory contents to disk in the background.

The basic idea is that changes made by committed transactions must be persisted in a durable, non-volatile storage.

> In simple terms, durability means that once a transaction commits, we can shut down the power right at that moment. The changes done by the transaction should still be in the database.

There are many durability techniques:

1. WAL - Write Ahead Log: Any changes (deltas) are immediately written to the WAL, which is stored on disk. This is quicker than actually updating the DB data structures.
   - In case of a crash, the data can be re-built using the WAL.
2. Asynchronous Snapshot: As we write, we keep all changes in memory, but in the background, we write all changes to disk, at once.
3. AOF - Append Only File: Similar to WAL, for keeping logs of changes, in the disk.

The idea is to write data persistently in a quick way, and also a durable way (in case data is lost, it can be re-computed).

In case our system crashed _during_ the commit, before the commit was finished, we are NOT guaranteed durability. It is only after a commit that we get a guarantee of durability. Therefore, commit speeds are critical, the faster we can commit the lower the chances of data corruption/loss.

#### WAL - Write Ahead Log

Writing a lot of data to disk is expensive (indexes, data files, columns, rows, etc.). So, DBMSs persist a compressed version of the changes, known as write-ahead-log segments.

#### The issue of OS Cache

A `write` request in OS usually goes to the OS cache, which is in-memory. The reason is that OS'es batch the writes and then collectively flush them to disk, for performance reasons.

In such a scenario, an OS crash and a machine restart could lead to loss of data.

The issue is that from the DB's perspective, the OS wrote the WAL segment to disk, and the DB can then report the transaction as having been committed, but the change could be lost untill the OS cache has been flushed to disk. This effect makes a DB no longer durable.

Because DB systems need guaranteed durability, they use the `fsync` command to force the cache to be flushed. This ensures that the data is written to disk, but it makes commits very slow. So, there is a tradeoff between durability and speed.

## Database Internals

### How Tables and Indexes Stored on Disk

The following are the key storage concepts in DBs:

1. **Table**: A logical table is a grid of rows and columns, where each row represents a different entity.
2. **Row_ID**: This is typically an internal and system maintained ID for each row. In certain databases such as mySQL, it is the same as the primary key. Other DBs such as postgres have a system maintained column of `row_id`.
3. **Page**: Depending on the storage model (row-based vs column-based store), rows are stored and read in logical pages. Pages are (usually fixed size) memory locations (that translate to disk locations as well). Pages are stored on disk.
   - A page can store many rows, depending on the page size and row size.
   - Typically, pages are of fixed sizes. Postgres has 8KB pages and MySQL has 16KB pages.
   - A DB doesn't read a single row. Instead, it reads one or more pages in a single IO, and we get a lot of rows in that IO.
   - e.g., if each page stores 3 rows, and there are 1001 rows, the number of pages necessary will be 1001/3 ~ 334.
4. **IO**: An IO (input/output) operation is a read request to the disk. _We try to minimize this as much as possible._ IOs are essentially the currency of a DB. Lesser the IOs, faster the query.
   - An IO can fetch 1 page or more depending on the disk partitions and other factors.
   - An IO cannot read a single row. It reads pages, with many rows in them. We get all the rows together. (In such a case, filtering/selecting based on specific columns would require deserializing the bytes of a page. This slows down query execution).
   - As stated before, **IOs are expensive, and must be minimized**.
   - Some IOs in OSes go to the OS cache, and not the disk. Some DBs such as Postgres rely heavily on the OS cache.
5. **Heap**: The heap is a special data structure, where a table is stored, with all its pages after one another. The actual data (_everything_ associated to a table) is stored here. Heap traversal is expensive as a lot of data needs to be read to find what is necessary. Indexes help tell us exactly what part of a heap we need to read and what page(s) of the heap we need to pull.
6. **Indexes**: An index is another data structure, separate from the heap, that has pointers to the heap. It has part of the data (specific columns) and is used to quickly search something. We can index on one or more columns. Once we find a value of the index, we go to the heap to find more information. Index tells us exactly which page to fetch in the heap instead of scanning every page.
   - The index is also stored as pages, and costs IO to pull the entries of the index.
   - The smaller the index, more it can fit in memory, and the faster is the search.
   - B-tree is a popular data structure for indexes.

#### Notes

Sometimes the heap can be built around a single index. This is called a **clustered index**, or an **Index Organized Table**.

Primary key is usually a clustered index unless otherwise specified. This means other indexes will point to the primary key, and the heap will be ordered according to the primary key (based on some data structure, usually a B-Tree).

MySQL and InnoDB always have a primary key as a clustered index, and other indexes point to the primary key value. **Therefore in such DBs we need to be careful while deciding the type of primary key**. Say our primary key is randomly generated. In such a case, insertions could be anywhere inside the heap, requiring high amounts of execution time.

Postgres on the other hand only has secondary indexes, and all indexes point directly to the `row_id`, which lives in the heap. But, in postgres updates cause creation and insertion of a new row with a different `row_id` (the `VACUUM` process will later remove the older version of the row, i.e., with the older `row_id`). Now, all indexes need to be updated with the new `row_id` as well, to be able to find newer rows. This is an extra cost.

### Row vs. Column Oriented Databases

These are two different ways in which DBs store data on disk.

#### Row Oriented Databases (Row Store)

Tables are stored as rows in disk.

A single block IO read to the table fetches multiple rows, with all their columns.

More IOs are required to find a particular row in a table scan, but once we find the row, we get all the columns for that row.

Such DBs can introduce multiple overheads if our queries refer to only specific columns, and the row has multiple columns.
Note that this doesn't mean `select *` is a good idea here. Although we get access to all columns of read rows, some columns may actually store pointers to some other locations, where the actual data is stored (this is done if data is too large to store inline, such as blobs or long strings). A query such as `select *` would require fetching and deserialization of even those columns, adding to the overhead, in case those values weren't actually needed.

#### Column Oriented Databases (Column Store)

Tables are stored as columns first in disk. Essentially all values of `col 1` are stored one after the other, followed by `col 2`, and so on.

A single block IO read to a table fetches a single column, and lots of rows' values for that column. (Clearly, if a column ends in a block and another one starts in the same block, we'll get valus associated with both columns.)

Less IOs are required to get more values of a given column. But, working with _multiple_ columns requires more IOs.

Such DBs are good for OLAP systems. They are commonly used in data warehouses and data lakes, where focus is on summarization and reads, and writes are minimal.

Each value is associated with its row_id.

e.g., say we have this table:

| id  | c1  | c2  |
| --- | --- | --- |
| 1   | a   | 30  |
| 2   | b   | 40  |

It will be stored like:

```
a:1, b:2
-----------
30:1, 40:2
```

Updation/insertion of any row requires modification of each column, i.e., lots of blocks.

Lookups based on columns are quick as we can go to very specific blocks to get our queried data. However, queries that require the values of multiple columns cause multiple IOs for different blocks. This is a significant overhead.
For this reason, it is almost always a bad practice to use `select *` in column stores. Placing a lot of columns in the `where` clause might also be slow.

Also, such DBs can also manage multiple duplicated values by storing an array of `row_id`s with the duplicated value.

I.e., instead of storing

```
q:1, w:2, q:3, e:4, r:5
```

we may store

```
q:[1, 3], w:2, e:4, r:5
```

#### Compairing Row and Column Stores

| Row Based                                                          | Column Based                              |
| ------------------------------------------------------------------ | ----------------------------------------- |
| Optimal for read/writes                                            | Writes are slower                         |
| OLTP                                                               | OLAP                                      |
| Compression isn't efficient (a row will usually not be duplicated) | High amount of compression                |
| Inefficient aggregation (like sum(...))                            | Efficient aggregation                     |
| Efficient queries with multiple columns                            | Inefficient queries with multiple columns |

Most DBs store tables in row based format by default, but it is possible to modify this on a per-table basis. We can decide what tables will be read from, what will be written to, and so on. However, joining a row-based table and a column-based table will be very costly, and might be prohibited.

### Primary Key vs Secondary Key

Consider a row store heap. When we add a row, it just gets appended. There is no ordering among the rows by default.

Now, when we create a **primary key**, we essentially perform a **clustering**. This is the process of arranging the table _around_ the key.

This creates an order in the table. This also incurs additional cost. Its almost like an index within the table.

This is called as **IOT** (index organized table, not IoT) in oracle. Other DBs call this a clustered index.

This may slow down writes, but reads, especially range queries are sped up.

This ordering is also the reason that we shouldn't choose our primary key randomly, as a random primary key may cause a lot of shuffling during insertion into the table.

Many DBs such as MySQL require a primary key set in a table, however, others like Oracle do not require a primary key (it is optional).

Alternatively, there is the case of a **secondary key**. We can create a secondary key just like we do a primary key. However, the table is _not_ sorted based on the secondary key. The heap structure remains unsorted. This in oracle is known as **Heap Organized Table (HOT)**.

We keep a separate structure, i.e., a **secondary index** as a B-Tree, sorted with respect to the secondary key. When some query requires access to the secondary key columns, this secondary index is used to get the `row_id`s or the page numbers of the relevant rows, and then those rows may be accessed.

This adds a slight overhead in the search time.

> By default, Postgres has secondary indexes, not clustered (primary) indexes.

### Databases Pages

DBs often use fixed size pages to store data. All entities in a DB, such as tables, documents, indexes, etc. are stored as bytes in a page. A page itself has a header and data and is stored on disk as a part of a file.

This allows for separation of data storage and retrieval, and that of data formats and API. Also, OS caching becomes easier to use when we only need to deal with pages.

DBs read from pages. To read a row, a DB first finds the page where the row lives, then identifies the file and the offset of the page on disk. The the DB asks the OS to read from the file, at the specified offset, for the length of the page. If the desired page is not in the OS's cache, OS issues the read command and places the page in memory for the DB to use.

A database allocates a pool of memory, called the **shared or buffer pool**. All pages read from memory are placed here. Based on row widths, we get access to multiple rows in the same page. This makes range queries efficient.

The same process is applied in the case of writes. A page is read to the shared pool, its contents are updated, a journal entry is made (say, in a WAL), and then after some time (to allow for other writes), the page is flushed to disk.

What we store in a page depends on the DB. Row stores store entire rows one after the other, while column stores store data column by column.
Document based (NoSQL) databases compress documents and store them in a page like row stores. Graph based DBs persist the connectivity in pages, so that page read is efficient in graph traversals. This can be tuned for DFS and BFS.

> The goal of modeling our data into pages is to make reads as efficient as possible. The lesser pages needed to be accessed for accessing our data, the better our data model will be.

**Page sizes** are another factor affecting performance. Smaller pages are faster to read and write, esp. if the page size is close to the media block size, but the overhead cost of page metadata compared to useful data may get high. Alternatively, larger pages mean lesser overhead, but slower read/write time.

The following are the default DB page sizes: (_we can configure them according to our usecase though_)

| Database           | Page Size |
| ------------------ | --------- |
| Postgres           | 8KB       |
| MySQL InnoDB       | 16KB      |
| MongoDB WiredTiger | 32KB      |
| SQL Server         | 8KB       |
| Oracle             | 8KB       |

Pages may be stored in many different ways on the disk. They may be sequentially stored in some cases other DBs may use a linked list structure. The implementation varies across DBs.

#### PostgreSQL Page Layout

> Here, a row and a tuple are used interchangeably, but a row is what a user sees. A tuple is a physical instance of the row.
>
> The same row can have 10 tuples, one active tuple and 7 left for older transactions (MVCC reasons) to read and 2 dead tuples that no one needs any more.

The default page size in PostgreSQL is 8KB. The components are as follows:

1. Page Header (24 bytes): This is a fixed size header, containing the metadata of the page, including the page contents, and free space in the page.
2. ItemIDs (4 byte each): This is an array of item pointers. It has the format `offset: length`. It tells where the item is in the page (`offset`), and how long is it (`length`). Though, this may add to the metadata overhead if too many rows are stored.

> This allows for the **heap only tuple** optimization in DBs such as Postgres. The optimization is that if a column of a row changes such that the new row can still fit in the same page as the old row, _and the column wasn't indexed upon_, the old ItemID pointer can simply be changed to point to the new row. This way, other data structures such as indexes need not be updated.

3. Items (variable length): This is where the items (such as tuples) are stored, one after the other.
4. Special (variable length): This part is relevant only to B+Tree index leaf pages. Each page links to the previous and the forward. Information regarding the page pointers is stored here.

## Database Indexing

An index is a data structure built on top of a table, that summarizes the information in some way, for faster lookups.

Mainly B-Trees and LSM trees are used for building indexes.

> As seen previously, all primary keys have indexes by default.

We can use `explain analyse <QUERY>` to see the runtime of our query, along with the execution time.

Also, string matching using `like <regexp>` cannot use an index on the string column, as indexes do not allow expression matching. (_In case we place an actual string there, without operators such as `%` and `?`, we still can do an exact match._)

### `Explain` Command in Postgres

This is a command that is used to view what is the query plan that postgres will use to execute a query.

When used, this command returns the query plan _without_ executing the query.

Some examples:

1. `explain select * from grades;`

This is a **bad query** because of the `select *`. It means that even if we use indexes, we still need to access the heap for the remaining columns. Also, there is no where clause.

The output will look like:

```
Seq scan on grades (cost=0.00..28901.01 rows=18273672 width=31)
```

Here, `Seq scan` means a sequential table scan. It may be `Index scan`, that means scanning the index, then the table (relevant rows), or it could be `Index only scan`, which means scanning only the index.

The various numbers are:

`cost`: Two numbers separated by `..`. The first is the time to begin fetch of first page (can be non zero in case of local pre-processing). The second is the time to fetch the last page (an _approximate_ value, as the query isn't actually run).

`rows`: The approximate number of table rows.

> This is way faster than a `count(*)`. So, when an approximate count of rows works, this should be used.

`width`: The width (size) of each _returned_ row in bytes. This is relevant from a network bandwidth point of view. If the results are being sent over a TCP channel, this may determine the packet size.

2. `explain select * from grades order by grade;`

Say there was an index on `grade` column. In this case the DB might do some pre-processing on it. So, the start time part of `cost` will be non zero.

3. `explain select * from grades order by name;`

Now, say there is no index on `name` column. The DB might first read the values, then sort them using multiple worker threads, then merge the results.

This will be very time consuming.

### Various kinds of Scans Done by DBs

#### Seq Scan

This is a sequential scan on the DB heap. (It is actually sequential in nature.)

This can be a very slow operation, as the whole table is accessed.

#### Index Scan

This scan is done when the queried columns have an index built on top of them.

The row IDs are received from the index, and the pages are accessed in a random access fasion.

> In case the DB _knows_ that a lot of rows will be scanned, irrespective of the index, It will resort to a Seq scan instead.
>
> Consider we run `analyse grades`. This will generate summary statistics for the table `grades`.
>
> Now, if we run `select name from grades where grade > 95`. The DB knows that a lot of rows will be returned (say a lot of students acheived a grade > 95), so its best to do a sequential scan. This is because a random scan using the index will be costlier than a seq scan.

#### Bitmap Scan

> Specific to postgres.

This is a special kind of scan. It is performed when the queried column has an index on it, and the estimated number of rows that will be returned is not too high to warrant a Seq scan, nor too low for an Index scan.

The idea is that the DB will go through the index and create a bitmap. The bitmap has one bit for each page. The pages containing atleast one desired row will have that bit set to 1.

Now, the DB scans through the heap, retrieving pages with the bit in the bitmap set.

Afterwards, among the fetched pages, we will still do another scan to apply the condition in the `where` clause, to get the actual rows. This last check is called a `Bitmap Heap Scan`.

A bitmap scan allows a 'merged' scan of multiple indexes. Say our `where` condition was

```sql
a > 50 AND b < 2
```

Now, if there are indexes on columns `a` and `b`, the DB can simply generate 2 bitmaps, and then `AND` them together to create a single unified bitmap. This will then be used to fetch the relevant pages, from where further filtering can be done.

This is typically called a `BitmapAnd` operation.

### Key vs. Non - Key Column Indexes

When we want to create an index in a database, we need to specify one or more fields (columns) to create the index (e.g., B-Tree) on.

**Key indexes** are conventional indexes, where field information is stored, and points to the actual rows in the table heap.

**Non - key indexes** are different, in the sense that we create them to specify some columns not to search for, but to include for quick retrieval. These are like associative memory. Say we have a table called `students`, containing student roll numbers (`ID`) and grades (`g`). We may create an index on the _key_ `g`, but also _include_ `ID`. Now, if we perform a select query on roll numbers based on grades, we need only access the index, and not the table's heap.

As a sql example, to create an index on the _key_ `g` in a table called `students`, run the following:

```sql
create index g_idx on students(g);
```

This is a purely Key index. Therefore, a query such as:

```sql
select g from students where g > 80 and g < 95;
```

will only access the index (`g_idx`). As the index is a B<sup>+</sup> tree, we can scan through it in a quick fashion to only access the grades that satisfy the specified conditions. However, a query such as:

```sql
select ID, g from students where g > 80 and g < 95;
```

will still have to access the table to get the `ID` values. While creation of `g_idx` would make this query faster, we still haven't acheived best possible execution time, as we access the heap pages.

> Note: If such queries are actually executed on a large table, repeated executions will be faster, as previous executions' results will be cached. Use `explain (analyse, buffers) <query>` to see amount of cache usage.

To acheive better performance, we can create our index in the following manner:

```sql
create index g_idx on students(g) include(ID);
```

Now, there is an index on `g`, that _includes_ `ID`. The above query will now get executed fully using the index, and the heap won't be accessed, speeding up query execution.

Had we performed an `explain (analyse, buffers)` on the query, we would find that the query now performs an **index only scan**, as opposed to the previously used **seq scans** or **index scans**.

> Remember that `vacuum` (garbage collection) and `analyse` (summarization for improved query planning) commands should be periodically run to keep the DB optimized. [This](https://stackoverflow.com/a/69206920/15060907) link provides more information on when to apply what operation.

As a summary, non - key indexes allow us to fetch commonly accessed columns faster, esp. in larger tables. However, as our index size grows larger, it can no longer be stored in memory, and has to be stored to disk. Accessing indexes stored in the disk is slower.

### Index Scan vs. Index Only Scan

An **index scan** is one where the DB uses an index built on a table to query that table. Based on the condition in the `where` clause and the scan of the index, the DB finds what rows are relevant to the search. However, the DB then actually performs IO to load those rows into memory and obtain data from them. This would occur, for instance, where the columns that were queried (in the `select` part) were not present in the index.

An **index only scan** on the other hand, uses only an index built on a table. The table is not accessed at all. This is done in cases where the index included all columns a user queried for. These columns may be non - key columns too; the important point is that they are present in the index.

In comparison between the 2, an index only scan is faster as long as the index is small enough to fit in memory. But, as indexes that allow for index only scans tend to be larger, they might have to be stored on disk. Hence, the right index must be carefully decided upon while designing the system.

### Combining DB Indexes

Say we have a table `test` with ~12mil rows. Each row has 3 fields: `a`, `b` and `c` which for now can be random ints from 1 to 100. We also have 2 indexes, one on `a`, and another on `b`.

Now, if we were to run the following query:

```sql
select c from test where a = 70;
```

This would probably first scan the index to get the rows where the predicate `a = 70` is `true`. Then, in this case (as the values were random, the number of rows would be less), the DB would perform a bitmap scan on the table to access the relevant values for `c`.

> In general, the DB performs a Seq Scan for a lot of rows, a Bitmap Scan for an intermediate number of rows, and a, Index Scan for a very small number of rows when accessing the heap.

Now, imagine we were to execute the following query:

```sql
select c from test where a = 40 and b = 50;
```

Now, as we had 2 indexes, one on `a` and another on `b`, the DB would create a bitmap for the rows where `a` is `40`, and another for rows where `b` is `50`. Then, it would `and` the 2 bitmaps together to get the final bitmap, which it will then use for a bitmap scan.

Had there been an `or` operation instead of the `and` operation, the DB will do the same, only it will perform a bitmap `or`, probably resulting in more rows.

Notice that in these situations, the DB had to scan _two_ indexes, along with the table.

Now, let us assume that the table did not have the 2 indexes on `a` and `b`, but a single composite index on both `a` and `b`. SQL - wise, we would do it like so:

```sql
create index on test(a, b);
```

> Note how the order of columns is specified: first `a` then `b`. This has an impact on the ordering of the index. This means that we can perform range queries on `a` and we can perform range queries on `a` followed by those on `b`. However, pure range queries on `b` won't use this index. See the examples that follow.
>
> In this case, the index will order values first based on `a`, and then where `a` values match, `b` values will be used for ordering.

Say we execute the following query:

```sql
select c from test where a = 70;
```

This uses the composite index we created, as a query on purely the leftmost column, `a` is involved. However, the following query:

```sql
select c from test where b = 70;
```

cannot use the index, as the index doesn't have an ordering based purely on values of `b` column. Therefore, this query would use a seq heap scan.

> According to the docs, an index on (`c_1`, `c_2`, `c_3`, ..., `c_n`) will go through the predicate to check for any equality constraints `c_1` onwards, upto and including the first inequality constraint on some `c_i`. For e.g., if the condition says `c_1 = 2 and c_2 = 5 and c_3 >= 20 and c_4 < 30`, only the `c_1`, `c_2` and `c_3` will be used to get a set of rows from the index. the remaining filtering (`c_4 < 30`) will get applied later.
>
> The docs further mention that the index _could_ be used even if a `c_1` predicate was not present in the `where` clause, but this would require the entire index to be scanned. In such a case, the query planner might just perform a seq scan on the table instead.

Based on this information, if we ran the following query:

```sql
select c from test where b = 70 and a = 20;
```

the composite index will be used for scanning for relevant rows. Then, the heap will be accessed to get the `c` values. In case our system expects a large number of such `and` queries, a composite index might be a good choice.

Now, consider the following query:

```sql
select c from test where b = 70 or a = 20;
```

This query cannot use the composite index in a binary search kind of way. It therefore will perform a full table scan in this case.

Now, for further comparison, let us create an index on just `b` besides the above composite index:

```sql
create index on test(b);
```

If we now run the following query:

```sql
select c from test where a = 70;
```

This uses the composite index on `a` and `b` to get the result. The following query:

```sql
select c from test where b = 70;
```

The DB will scan the newly create index on `b` to get the result. The following query:

```sql
select c from test where b = 70 and a = 20;
```

will use the composite index on `a` and `b`, as before. Furthermore, the query:

```sql
select c from test where b = 70 or a = 20;
```

will scan the composite index to get the row bitmap corresponding to `a = 20` and it will scan the index on `b` to get the row bitmap corresponding to `b = 70`. Then, these will be `or`'d to get a final bitmap for a heap scan. (The actual mechanism varies based on predicted number of relevant rows. The DB might go for an index scan or a seq scan.)

The discussion in this section shows what kinds of indexes can be created, and also how to design towards an optimal set of indexes for any DB use case.

### How DB Optimizers Decide to Use Indexes

It is the DB optimizer's job to decide which index to use for some query, especially if we have multiple indexes.

> In the following text, we'll say a DB _predicts_ number of returned rows. It keeps table - level statistics for these predictions.

Say we have a table `t`, with 2 columns `F1` and `F2`. The index `F1_idx` has been built on `F1` and the index `F2_idx` has been built on `F2`. If we ran the following query:

```sql
select * from t where F1 = 1 and F2 = 4;
```

We can have the following cases:

**Case 1: Both indexes used to query**

In this case, `F1_idx` will be used to search `1` while `F2_idx` will be used to search `4`. The 2 indexes will give us 2 sets of row ids or tuples (in case of postgres). As the query had an `and` operation, these 2 sets will undergo an intersection operation to get the final set of row ids/tuples.

This will occur when the predicted size of resultant sets is not too small nor too large. As an `and` operation is happening, if the DB knows any one of the resultant sets is going to be small, its not worth the effort to search the other index. It can just filter the actual table rows. On the other hand, if the DB knows that a _large_ number of rows are going to be involved, it will just perform a heap scan.

> The exact functioning is decided by the heuristics the DB uses.

**Case 2: Only one column's index used, and the other's _ignored_**

In this case, say only `F1_idx` is used. The DB will look for those rows where `F1 = 1` is `true`. Then, those rows will be fetched from the table, and the predicate `F2 = 4` will then be used for filtering among the fetched rows.

This will especially happen in cases where an `and` is used in the `where` clause. If the DB knows that the number of rows returned is going to be very less for `F1` and high for `F2`, it will only use the index on `F1`. Moreover, say that `F1` was a primary key. Because of its uniqueness condition, the DB will only use the index on the primary key as in that case it knows that at most, only a single row will be returned.

The situation will be different if the condition was an `or`.

**Case 3: Both indexes ignored**

In this case, the DB predicts that a significant portion of the table will have to be scanned irrespective of the results obtained from the index scans. So, it decides to omit the index scanning, and it instead performs a sequential heap can (sometimes with parallel worker threads). During this scan, the `where` predicate is also applied.

All these 3 cases have shows what kinds of scans a DB might do based on its table statistics. This shows the importance of accurate statistics of a table. Consider an example where the statistics were incorrect. Say we have just created an empty table, and we insert a few (5 - 10) rows in this table. By this time, the statistics will have been updated to reflect the table's contents. (Statistics updation occurs asynchronously.) Now, say we insert a few million rows into the table, but forget to manually update the statistics. The stats will take some time to be automatically updated. In the meantime, any `select` query on the table will use the previous statistics (according to which, the table size is still very small). This means that the DB will resort to a full table scan instead of using any indexes that may have also been created on the table. As we added a _lot_ more rows, this is going to be very slow. Therefore, we must always remember to perform manual statistics update (using `analyse` on Postgres or equivalent command elsewhere) and also cleanup (using `vacuum` on Postgres or equivalent command elsewhere).

These 3 weren't an exhaustive set of cases. As a summary, it is important to consider for a given query, how many rows do we expect from an index, and is it better to simply scan the table instead.

#### Database Hinting

If we or our application has more knowledge about the query than the optimizer, we can use database hinting. **We can essentially force the optimiser to use a specific plan to pick an index over another.** This is especially useful if the statistics are not up to date.

We perform hinting via comments:

```sql
select * from t where F1 = 1 and F2 = 4
  /*+ INDEX[F1 F1_idx]*/
  ;
```

The above forces the DB to use `F1_idx` in its plan to scan for `F1` values.

### Concurrent creation of an index on a production table (avoiding blocking of table writes)

When an index is being created on a table, all writes on that table are blocked until the creation ends (reading is still allowed though). On a large table, index creation can take considerable time. This means that on a production table, table writes may be blocked for an extended period of time. This is undesirable.

To allow for concurrency in index creation and table writes, postgres has implemented a concurrent index creation. We create a concurrent index as follows:

```sql
create index concurrently g_idx on students(g);
```

This command causes a creation of an index called `g_idx` on the column `g` of a table called `students`. Writes to the table will be allowed even during the index creation.

What this command essentially does is that it creates the index in multiple scans, and between each scan it pauses the index creation to allow for queued up writes to be executed.

Such index creation must be used cautiously, as it requires much more time, CPU, and memory. It therefore may take up system resources from other processes. **This command can also potentially fail.** The command may fail in case some invalid data was inserted into the table. Then, the index will have to be dropped and re - created.

According to Postgres docs:

> If a problem arises while scanning the table, such as a deadlock or a uniqueness violation in a unique index, the CREATE INDEX command will fail but leave behind an "invalid" index. This index will be ignored for querying purposes because it might be incomplete; however it will still consume update overhead. The psql \d command will report such an index as INVALID.

Read more about the concurrent index creation in the docs [here](https://www.postgresql.org/docs/current/sql-createindex.html#SQL-CREATEINDEX-CONCURRENTLY).

### Bloom Filters - Quick Lookup for Absence of Values

Consider a problem: we are given a username, and we have to tell whether it already exists or not.

This is a relatively simple task. There will be a frontend that will send a `GET` request to the server along with the username as a query param. Then, the server will execute a query to search for the username in a DB table. If a record comes back, that means the username exists, otherwise it does not.

There is an issue with this approach. It is too **slow**. A username retrieval must be fast, as multiple users will be trying out multiple usernames. This can severly hamper our system performance.

An alternate approach might be a cache mechanism via a tool like Redis. We might cache the set (or subset) of existing usernames in memory and only lookup the DB if a queried username wasn't present in the cache. However, this approach also has issues. We are essentially **increasing out memory footprint** and also, we **might have to lookup the DB anyway**. This is too much overhead for a username lookup.

Bloom filters provide an efficient solution to this problem. A bloom filter is essentially a hash table. The way these work is that we hash every username present in our database. Then, we place a set bit (`1`) in the hash table for those hashes that came from atleast one present username (multiple usernames might gave us the same hash). The hashes that did not exist are unset (`0`). This hash table is stored in memory.

Now, whenever we need to lookup a username, we will first hash it and see if the hash value in the hash table is set. If it is unset, we can be sure the username does not exist in the DB. If it is set, we still query the DB to check for this specific username.

In general, any time we need to execute some query but aren't sure if we will get a result or not, we can benefit from using bloom filters.

Let us consider an example of bloom filter construction. We start of with a bitset with all values 0, and an empty table. For this example, consider the hashing compresses in $mod$ $64$ system, i.e., hashes go from 0 through 63. The bitset will also have 64 bits, 0 - 63. Now, let's say there is a new username called `Jack`. Its hash value comes out to be `63`. We'll first set the bit at index 63 in the bitset, and then insert `Jack` into the DB.

Now, let's say another username `Paul` is to be inserted, with the hash `3`. In the same way as before, we'll set bit `3` and then insert `Paul` into the DB.

When another username `Tim` is entered, we get a collision, as its hash is also `63`. As bit `63` was already set, we simply insert `Tim` into the DB.

There can be lots of implementational details in actual bloom filters, such as large hash space, multiple hash functions, and so on.

One issue with these filters is that when all hash values (`0 - 63` above) are set, the filter is essentially useless and won't give any speedup. In those cases, we'll have to always query the DB. We _might_ perform a re-hashing to create the filter larger (increased hash space), but then we run into issues of extra memory usage.

> Short bloom filters: lots of false positives and consequent DB access
>
> Large bloom filters: high memory footprint.

### Working with Billion Row Tables (Large Tables)

As we design database systems, one important question we often ask is how do we anticipate a table to grow in the upcoming years. Specifically, we focus on the question: "will the table grow so much that it will reach a scale of billions of rows?". We will discuss 3 ways our algorithms can go:

**Case 1: Brute Force**

We might try to treat the table as a normal table. No indexes and only parallel sequential scans. Essentially, we would launch multiple worker threads for each query, possibly distributed across various machines. Each worker would work on its own chunk of data. This method will not be very effective on OLTP DBs, as they will go out of date once the processing begins and writes are blocked. However, this is a common procedure followed with **big data**, where we have large read - only tables and no indexes.

MapReduce is an example of this method.

**Case 2: Processing a subset of the table**

We might create an index for the table and use it to locate only those pages that are relevant to our query. Then, we would proceed to perform a scan on the data in those pages.

We might also perform partitioning of the table (discussed later in notes). Specifically, horizontal partitioning. We store a part of the table at one location, and the other part at another location. We partition on a _partition key_, which in the `where` clause can tell us where to look for rows. Essentially, each partition will have its own index, and this setup will be managed by the DB.

To add, we can also distribute the partitions across multiple hosts via sharding (discussed later in notes). So, each shard will contain multiple partitions. This does reduce the load on a single machine, but now each client needs to be aware of which table to go to for what data.

Essentially, we have

```
  Shards
    |
    |
Partitions
    |
    |
  Index
```

**Case 3: Removing the need for a billion row table**

We might address the question as to why we got a billion row table in the first place. We would have to re-create our designs, but it is possible that will some different schema (possibly using JSON as a field) works with lesser number of records.

### The Cost of Long Running Transactions

When a DML query modifies a row, in DBs such as Postgres, a new version of that row is created. Barring the cases of the heap only tuple optimization (where the row pointer in the rows's page's metadata is updated), the row's most recent tuple id will have to be placed in all indexes.

Say a transaction ran for a long time. It updated millions of rows in the DB. Now, if it fails and rolls back, all the millions of new row versions need to be discarded. This can be done in a variety of ways. We might do so eagerly right after the rollback, we might do it lazily as a post-rollback process (the way Postgres does, via the `vacuum` command that is run in the background periodically), or, we might lock the table, perform a cleanup and restart the DB. Many DBs follow the eager process, where all tables are locked, the transaction is rolled back using undo logs, and only then are we allowed to restart the DB.

Now, consider the lazy approach. Dead rows are left in the table to be dealt with at a later stage. This **won't** lead to correctness issues, as transactions know not to read dead rows. They do this by checking the state of the transaction (committed\rolledback) that created them. This is an expensive check. Moreover, this leads to inefficient IO. As dead rows are stored on disk among the live rows, the DB has to filter out the dead rows. Moreover, with an increased number of dead rows, a DB needs to fetch more pages to get the same number of live rows. For example, a page may contain 999 dead rows and just 1 live row. The DB would do the IO, but only get a single row out of it. It will have to perform more IOs, reducing efficiency and performance.

We must carefully pick what DB we require keeping this among other procedures in mind.

### Microsoft SQL Server Clustered Index Design

[This](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-index-design-guide?view=sql-server-ver15) SQL server doc link (or [this](./MS%20SQL%20Server%20Clustered%20Index%20Design.pdf) PDF of the website) provides an in-depth analysis of the internal design that microsoft used for SQL Server indexes.

SQL Server creates all tables as a clustered index (Index Organized Table) by default, although there is an option to create heaps (Heap Organized Tables).

#### Clustered Index Architecture

This index contains the actual data of the table as well. A very top-level description of this index follows.

This index is organized as a B-Tree. Mathematically, b-trees have arrays of objects in place of just a single object as is the case in binary search trees. In SQL Server, these "arrays" are pages (each node of a B-Tree is a page). These pages are called **index nodes**.

The top index node is the root node, the bottom ones are leaf nodes. All index nodes at any given level in the tree have pointers to their next and previous nodes (i.e., they form a doubly linked list).

In clustered indexes, the leaf nodes contain actual data pages of the table. All other nodes (root and intermediate nodes) contain index pages, containing index rows. The index rows assume the role of the "object" mentioned above. Each row has a value and a pointer to some other intermediate node in the B-tree or to some data row at the leaf level.

#### Nonclustered Index Architecture

These have the same structure as a B-tree index, except for the following 2 aspects:

1. the leaf nodes are made up of index pages, not data pages; and
2. the data rows of the underlying table aren't sorted. They are stored in the order of their nonclustered keys.

## B-Tree vs. B<sup>+</sup>-Tree in Production DB Systems

### The Problem: Full Table Scans

A full table scan (or, sequential scan) requires us to go through an entire table to find a row. Reading large tables is a slow process, requiring lot of IOs to read all its pages.

```
Load a page -> scan through it -> retain only result rows -> load next page and repeat
```

> Note that DBs have their own page sizes as described before. However, the OS loads different amount of data at a time from disk, measured in _blocks_ or _sectors_<sup>clarification needed</sup>. Therefore, should the page size be larger, each page will require multiple disk accesses. This in general is not bad, but if for whatever reason a different page size is to be used, usually the DB needs to be re-compiled from source with the new value specified as the page size.

Although this process is optimized in modern DBMSes, there are still ways to improve via indexing.

### Original B-Trees

B-Trees are a balanced data strucutre, that have been developed for fast traversal during search, by minimizing the search space.

B-Trees have `nodes`. A B-tree also has a degree, denoted by `m`. This means that each `node` can have `0` to `m` children nodes, and `1` to `m-1` `elements` inside it.

Each `element` inside a B-Tree has a key and a value. The value is usually a data pointer to a row. A data pointer can either point to the primary key (in case the table has a secondary index), as is the case in Oracle and MySQL or directly to some tuple, as is the case in Postgres.

The **root node** is the topmost node of the tree, an **internal node** is any node other than the root which contains children. The **leaf nodes** are those nodes that have no children.

In practical use cases, _a node corresponds to a disk page_. Therefore, each node should have enough data to fit the whole page. (This aspect, like most low-level aspects regarding B-Trees is handled by the DB.)

### Performance Enhancement by Original B-Trees

In the internal representation of a table, each row has an internal ID, called the row id (`RID`). In postgres, a row may be represented by multiple tuples, and therefore, tuples make up a table. There we have tuple ids.

> Note: The `RID` or tuple id is not the logical id (primary key). It is an _internal_ reference to a row or tuple, that may also contain the page number of the row/tuple.

Say a user creates an index on a table on the field `gpa` that contains floating point values from 0 to 10.

Each node of the B-Tree will contain multiple elements, and each element will have a key-value pair. The keys will be values of the `gpa` field, in the sorted order according to the rules of the B-Tree. The values will be the row id or the tuple id (aka the **data pointer**) that have that particular `gpa`. In case the index was made on some field with the `unique` constraint (such as on the primary key column), each value will be a single data pointer. In case uniqueness is not guaranteed, the value may be aset of data pointers.

> The sorting/arrangement of elements in the B-Tree is determined by the keys, while the values store data pointers to rows/tuples of the actual table.

To search in the B-Tree, loading each node (not element, but the whole node) constitutes an IO, as a node is an entire page. Other than this, the usual B-Tree search algorithm is followed.

Once the search is completed, the DB has a set of row/tuple ids. These ids contain the information of what page(s) their row/tuple resides in, and the DB will only load the relevant pages.

Insertion/updation/deletion of nodes occurs in pretty much the usual B-Tree way, only, there is an IO loading component involved. One important node regarding these operations is that often we might need to split and merge pages. This is costly, and therefore `m` (degree of the B-Tree) should be large enough to avoid too many page splits/merges to the tree. Also, if the elements of the indexed column are inserted out of order, page splits required in the tree will mostly be more than in the case the elements are inserted in order, therefore _out of order insertions will be slower on the index_.

> Note that when we create an index on a column with a large sized datatype, such as a `string` or `uuid`, the keys in the B-Tree will be large too, thereby decreasing the number of elements per node (as the node size is fixed to be the page size), and requiring more IO. Index on small datatypes will lead to faster search.

### Limitations of the Original B-Tree

1. **Elements in all the nodes store both the keys and the values.** Therefore, anytime we are searching a B-Tree and we load a page, we not only access the keys but we also waste memory by loading those row/tuple id values that are not required by us. This also means that the elements will take up more space, leading to more nodes, leading to more IO, decreasing search speed.
2. **Range queries are slow because of random access.** Say we want all values from `1` to `5`. We will have to search for the key `1`, then for `2`, and so on uptill a search for `5`. This leads to much more traversals and therefore, much more IOs. (In practical situations, the number of traversals may be lesser, but still B-Trees require a high amount of traversals for range queries.)

Also, when the index is on a column with a large datatype, storing it in memory becomes difficult, leading to slow disk access (this is aggravated by the issue described in point 1 above, that the values are also stored with the keys). Say we have a primary key that is a large string, on a heap organized table. The secondary index will be very large and hence will be stored on disk, which will lead to slower search.

### B<sup>+</sup>-Trees

These are exactly like B-Trees, but they only store keys in internal nodes. The **values are stored in the leaf nodes**. This means that internal nodes are smaller, since they only store keys. They therefore can fit more elements.

Leaf Nodes are linked to other leaves according to the sorted order (only some DBs actually implement this). This helps for ordered leaf node traversal, simplifying range queries. Essentially, this means that once we find a key, we can find all values before and after that key.

The following image shows a B<sup>+</sup>-Tree (only the keys are shown, but the values are stored on the leaves as well) with `m` equal to `3`:

![B+-Tree Image](./B+-Tree.png)

Note how the internal nodes only store keys, meant for a traversal and how the leaves store the keys again. Although not shown in the diagram, the leaves also store the row/tuple ids that have those keys in them. The leaf node links are also displayed in the diagram.

Essentially, we get faster traversal at the manageable expense that _some_ (not all) keys are duplicated. The extra memory cost can be shown to be very small, and it doesn't add to the memory complexity.

In real DBs, `m` is large enough to accomodate enough elements in each node to add up to the size of a page.

> In B<sup>+</sup>-Trees, traversal ends when we find the key on the leaf node. Even if we find the key on the internal node, we still go to the leaf.

### B<sup>+</sup>-Trees and DB Considerations

Now, in B<sup>+</sup>-Trees, there is an additional cost due to the leaf pointers, but this cost is very small.

> Some DBs might use other trees as an alternative, such as LSM trees.

As the internal nodes are now small in size (they are still equivalent to a page; size refers to size per element), they can also be fit in memory (cached) for faster traversal. (This also depends on _what datatype_ we indexed on. Larger datatypes such as uuid may have to be stored to disk.) Leaf nodes however can live in the disk within the heap data files.

Most DBs use B<sup>+</sup>-Trees, even when they may refer to them as "B-Trees".

### Storage Cost of B<sup>+</sup>-Trees in MySQL vs. Postgres

B<sup>+</sup>-Trees secondary index values can either point directly to some tuple (Postgres - heap organized table) or to the primary key (MySQL - index organized table; clustered index).

Now, if the primary key data type is large, it can cause increase in the sizes of all the secondary indexes in DBs such as MySQL (innoDB). Whereas, tuple IDs are small in size.

> Therefore, secondary indexes will be larger in MySQL when the primary key column has a large datatype. This will lead to slightly slower search times. **Therefore, we should carefully plan the required sizes of all our DB columns, especially the primary key column, from a scalibility point of view.**

## Database Partitioning

> "The quickest way to query a table with a billion rows is to avoid querying a table with a billion rows."

Database partitioning is a mechanism where we split a large table into multiple smaller tables (partitions), and let the DB decide which tables to hit based on the `where` clause.

> Unless otherwise mentioned, "partitioning" refers to horizontal partitioning.

Say we have a table with a million rows, but no index on it. Any table scan will require scanning the entire table. However, if we partition the table (into smaller tables called partitions with the same schema), and the `where` clause is such that a subset of the partitions can be identified, we only need to scan those partitions.

We can think of partitions as "children" to the main (_actual_) table.

Partitioning is done based on a **partition key** column. If this column is present in the `where` clause, we can benefit from the partitions.

> All columns in the partition key should be `not null`.

Note that in a partitioned table, _each_ partition has its own index. So, if we create an index on a table with 5 partitions, 5 indexes will be created, one per partition.

### Vertical vs. Horizontal Partitioning

Horizontal partitioning involves splitting the partitions by rows (as dicussed so far). Therefore, mathematically speaking, each partition is a set and each row of the table is placed in exactly one of these sets.

> Imagine a table printed on an A4 paper. Horizontal partitioning is analogous to horizontally cutting this paper into parts.

Vertical partitioning on the other hand involves splitting a table by columns (_kind of_ like normalization). This is useful in cases where, say we have a large column (for e.g., of type `blob`) that we rarely access. We can vertically partition our table to move that column into another table, that can be stored in a different medium (such as a hard disk rather than SSD).

### Partitioning Types

There are several types of horizontal partitionings:

1. **By range**: This occurs when we partition on ranges of a column's values (such as a partition on a `date` column `logdate` to allow logs from different dates be stored in different tables or an `int` column `customer_id` that creates partitions based on ranges of ID values).
   - This applies to those columns whose datatypes have a logical ordering and are inherently continous in nature.
   - A benefit of partitioning by date ranges is that older data partitions may be moved into slower storage media, freeing up fast access media.
2. **By list**: This is performed on columns with discrete values (such as partitioning on a `state` column). Here, there is no implicit ordering between the values - they are discrete and categorical. So, we may have a partition where those rows that have `state = UP` are stored and another partition where those rows that have `state = Kerela` are stored.
3. **By hash**: This is a popular basis for partitioning (used in Cassandra, for e.g.). Based on the hash values of some partitioning columns, one among several partitions (buckets) are chosen to store a row in.

### Horizontal Partitioning vs. Sharding

In horizontal partitioning, a table is divided into partitions and stored in the same database. The DB takes care of the management of these partitions. The client (the user who writes the query) is unaware of what partition will be used and is therefore agnostic.

On the other hand, sharding splits a big table into multiple tables across multiple DB servers. These arevers are completely different, and the aim is to have distributed processing. For e.g., for users in Asia, we may have one DB shard, whereas for users in North America, we might have another. Each user knows _their_ target shard's IP address and send any queries to the correct IP address.

In horizontal partioning, there are multiple table names for a table, whereas in sharding, there is a single table name, and each shard has a table with this name.

### Partitioning Demo

Say we have a table `grades_org` with 2 columns: an `ID` and `g`, an integer column for grades. There is also an index on the table, `grades_org_idx`. Initially, say the table is not partitioned.

This table by itself cannot be partitioned, however, a new table with the same data can be created. The new table in this case will be partitioned on _ranges_ of `g`, as follows:

```sql
create table grades_parts (id serial not null, g int not null) partition by range(g);
```

Now that the table is ready, we create all the partitions by ourselves. Then, we attach the partitions to the table.

```sql
-- Creating partitions

create table g0035 (like grades_parts including indexes);
create table g3560 (like grades_parts including indexes);
create table g6080 (like grades_parts including indexes);
create table g80100 (like grades_parts including indexes);
```

```sql
-- Attaching partitions

alter table grades_parts attach partition g0035 for values from (0) to (35);
alter table grades_parts attach partition g3560 for values from (35) to (60);
alter table grades_parts attach partition g6080 for values from (60) to (80);
alter table grades_parts attach partition g80100 for values from (80) to (100);
```

So far, we have setup the partitions, but the table itself is empty and has no indexes on it either. (We used `including indexes` when creating the partitions to include future indexes.)

Now, let us insert all data into this partitioned table like so:

```sql
insert into grades_parts select * from grades_org;
```

Now, based on the value of `g`, for each row, the DB will decide which partition the row will enter.

Further, we may want to create an index for our partitioned table. Prior to Postgres 11, the only way to do so was to create an individual index on each partition. Later versions allow creation of a single index on the partitioned table as a quicker way to acheive the same result.

This command will create 4 indexes, one per partition:

```sql
create index grades_parts_idx on grades_parts(g);
```

Now, to compare index sizes, consider the following queries:

```sql
explain analyse select count(*) from grades_parts where g = 30; -- Q1
explain analyse select count(*) from grades_org where g = 30;   -- Q2
```

Here, `Q1` queries the partitioned table, while `Q2` queries the non - partitioned table. In a normal computer, the execution plan displayed will not show a high difference, as the indexes of both tables can be loaded into memory. The following way to check the index sizes, however, will show the importance of partitioning to reduce index size:

```sql
select pg_relation_size(oid), relname from pg_class order by pg_relation_size(oid) desc;  -- Works in Postgres
```

This will display that the indexes on the partitions are way smaller compared to the full table index (3 - 4 times smaller). This will result in a performance boost when the system grows.

#### Partition Pruning

This is a flag in postgres which when turned `on` (default value), any scans take into account the elements of individual partitions. I.e., say our `where` clause contained the partition key. When pruning is enabled, only the relevant partitions will be scanned. If this flag were `off`, _all_ partitions will be scanned. Essentially, the DB will ignore data separation based on the partition key.

This should stay `on` in most cases.

The following command shows the value of this flag:

```sql
show ENABLE_PARTITION_PRUNING;
```

The following command turns the flag on:

```sql
set ENABLE_PARTITION_PRUNING = on;
```

### Advantages of Partitioning

1. Partitioning improves the query performance when accessing a single partition or a smaller subset of the partitions. This is especially true in large tables, or when there are bounds to memory and IO.
2. Often the query planner has to make a decision whether to perform a sequential scan or a scattered index scan (i.e., going to the index and then to the heap of the table, multiple times). Partitioning decreases (partition) table sizes, and therefore makes it easier to make the decision of sequential vs. index scan.
3. We can load bulk data easily into a partitioned table. Assumming we load a lot of data into a table in our DB, and the schema and constraints of this table are the same as that of a partitioned table, we can simply attach this table to the partitioned table via `attach partition` and the data of this table will be accessible via the partitioned table.
4. We can move those partitions that are rarely queried into cheap storage such as hard disks, freeing up more space on faster storage media such as SSDs.

### Disadvantages of Partitioning

1. Updates that move rows from one partition to another are slow. They could even fail at times. Say that any column(s) from the partition key are being updated in a way that their partition has to change. When this happens, the entire row will have to be moved from the heap area of one partition to the heap area of another partition. This is time consuming. Too many such updates will cause high amounts of R/W operations on the storage medium, reducing its lifetime and harming it. Therefore, we should try to avoid updates that cause movement of rows from one partition to another.
2. Inefficient queries could accidently scan all partitions resulting in lower performance. This could occur, for e.g. where our `where` clause covers a lot or all of the partitions. This will cause the DB to have to access multiple partitions, leading to increased IO, and given that multiple tables are involved, lower cache efficiency.
3. Some schema changes can be tricky. For e.g., creating an index on the partitioned table creates an index on each of the partitions. However, this must be specifically supported by the DB. Similarly, not all schema changes may be easy to apply.

### Automating Partition Creation

In certain cases, there may be too many partitions to create manually. We can automate the partition creation process using a script.

Say we have a customer table with the information of about 1 billion customers. We want to create 100 partitions for such a system, each with about 10 million rows.

The code [here](./automate_partitions/create_partitions.mjs) displays a JS based automation.

## Database Sharding

Traditional DB systems have a centralized table where all data is stored (i.e., on a single server) and any access requires accessing the DB server. This becomes an issue as the number of connections and size od DB increases. The single server becomes a bottleneck.

This problem gave rise to DB sharding. A table is split up into multiple parts and each part is placed into a separate DB server.

A table is _horizontally_ split (row by row) based on some **shard key** columns and for each row, these columns decide which shard that row will be placed in. Note that each row goes into exactly one shard. Finally, each shard is placed into a separate DB server, i.e., with a separate IP address.

Some common types of shard keys include location values (such as users' PIN codes). Other values include some numeric ID field. In some cases however, an ordering mmay be difficult to obtain (such as in `string` columns). Then, hashing can be used on such columns. The hash can then be mapped to a server.

> A hash function that is highly consistent in nature is better to use.

To query the DB, we first need the shard key columns in our `where` clause. Then, we locate which servers need to be accessed. Finally, we send a request to only the specific servers.

### Consistent Hashing

Let's assume we have 3 shards. The idea is that we will have some shard key, which we will pass into a function. Then, this function will return us a reference to one of the 3 instances to place this record in.

One way we could do this is:

```
indexOfShard = toNumber(shardKeyBytes) % 3
```

We somehow convert our shard key into a number and then take the remainder with 3, obtaining the index of the shard in question.

This is a common approach in multiple DBMSes, with varying implementations of the `toNumber` method.

The background behind consistent hashing is to create a **hash ring** structure (logically). [This](https://www.toptal.com/big-data/consistent-hashing) link describes the structure in more depth.

### Horizontal Partitioning vs. Sharding

There are similarities between horizontal partitioning and sharding, but these are different concepts.

In horizontal partioning, a large table is divided into several small tables (partitions) with _different names_ in the _same DB server_.

In contrast, in sharding, a large table is split _across different DB servers_ but the _same table name_ is used.

### Demo

In this demo, we will create 3 postgres instances on 3 ports: 5432, 5433 and 5434. Then, we will perform read and write operations on the shards via JS.

Our objective is to create a URL shortener.

First, we need the command to create the sharded table. This should be consistent across shards:

```sql
create table URL_TABLE (
  id serial not null primary key,
  URL text,
  URL_ID character(5)
);
```

This we save in a folder called [sharding_demo](./sharding_demo/).

We then also create a custom Dockerfile that creates an image that executes the sql script:

```dockerfile
FROM postgres
COPY init.sql /docker-entrypoint-initdb.d
```

The idea of the `COPY` command is that it causes the execution of any `.sql` scripts when the instance is run.

Now, we need to actually build the image from this file. For this purpose, we run the following command from within the above directory:

```bash
docker build -t pgshard .
```

The `-t pgshard` lets us give a tag name to the image and the `.` specifies the directory where our `Dockerfile` is.

Now, we are finally ready to create containers using this image to serve as our shards:

```bash
docker run --name pgshard1 -e POSTGRES_PASSWORD=password -p 5432:5432 -d pgshard
docker run --name pgshard2 -e POSTGRES_PASSWORD=password -p 5433:5432 -d pgshard
docker run --name pgshard3 -e POSTGRES_PASSWORD=password -p 5434:5432 -d pgshard
```

This will create 3 postgres instances, exposed on localhost ports 5432, 5433 and 5434.

Then, we run a `pgadmin` container:

```bash
docker run --name pgadmin -p 5555:80 -e 'PGADMIN_DEFAULT_EMAIL=postgres@postgres.com' -e 'PGADMIN_DEFAULT_PASSWORD=postgres' -d dpage/pgadmin4
```

Finally, once `pgadmin` container is running, go to [http://localhost:5555/browser/](http://localhost:5555/browser/) and use the login credentials in the command above:

```
email: postgres@postgres.com
password: password
```

Once the pgadmin dashboard is accessed, register a new server with the name `shard1`, username `postgres`, password `password`, port `5432` (for _all_ shards) and the host IP address of the docker container named `pgshard1`. To get the IP address of `pgshard1`, run `docker inspect pgshard1` and get the `"Networks"/"IPAddress"` value.

Perform the same procedure for the 2 other shards, `pgshard2` and `pgshard3` to register 3 servers in total on pgadmin dashboard.

By accessing the `shard[i]/Databases/Schemas/public/Tables/urltable`, in each server dropdown, we can confirm our `init.sql` command ran to create the `URL_TABLE` in all 3 shards.

> As the `pgadmin` container is also running within docker, we used the internal docker IP address for each shard and the port `5432` for each shard. Had we run pgadmin from outside docker, we would have used the forwarded ports 5432, 5433 and 5434 along with the `localhost` host domain.

Finally, our sharding setup is ready.

For the JS code to use shards, please view [this](./sharding_demo/writing_to_shard/) folder.

We use the `pg` library to connect to the Postgres DB.

### Advantages of Sharding

A major advantage of sharding is that we get scalability. We can distribute our DB across various computers, obtaining scalabe storage and effectively more memory and CPU resources in a distributed manner.

We also get security by sharding. For example, user data can be kept separately for different users so that a user only has access to their shard. We may also keep more sensitive kind of information on a separate shard.

Sharding also lets us reduce our index sizes, allowing indexes to fir in memory and provide quicker lookups.

### Disadvantages of Sharding

As now the client needs to be aware of the shards, they become more complicated. There are multiple DB servers running, and the client must know which one to hit.

Transactions that work across shards are also a problem. For example, an insert query that inserts 2 rows in 2 different shards will be difficult to run atomically. Similarly, rolling back a single logical transaction that uses multiple shards is also difficult.

> ACID properties are difficult to ensure when a DB is sharded across multiple DB servers.

Schema changes have to be done on each shard instead of just one. We must ensure each shard is updated correctly.

Performing joins on sharded tables is very difficult and slow, as the table data is in multiple machines. This is one reason we might prefer horizontal partioning to sharding.

We must have the sharding key in our query. If we don't know it or are querying on some other parameters, we will have to query each shard, making the process very slow. For example, if our customer table is sharded based on the customers' state of residence but we need to query for all customers over the age of 70, we'll need to query each shard.

### When Should we Consider Sharding our Database

> Practically, don't shard a DB unless it is absolutely necessary as sharding introduces unnecessary complexities to a system.

Say we have a relational DB to begin with. We need this DB for a web application, with a web server that uses an API framework, such as NodeJS.

At this point, the issue is that a lot of requests can arrive simultaneously at the DB server, leading to a bottleneck. Moreover, to read data we have to access tables, which will get larger as more and more data is added. Now, we must correctly identify our problem - **our _reads_ are slow** (writes are fine so far).

We may create an index, but the read benefits will be limited as the table grows.

To further speed up table reads, we may now consider partitioning the table. As long as the client is aware of the partition key, the DB can know which exact partition to hit, speeding up reads.

At this point, we may face a different problem - **our DB server might not be able to handle the number of TCP connections that are required by the users**.

To solve this problem, we may replicate our DB across different backup servers, with a single master server. The master server periodically will push edits onto the backups. So, we have multiple backup servers from where the users can read and a single master server that allows reads and writes (we may only write to the master). This helps reduce the networking load on any single server.

So far, we have load balanced the read requests, but in certain cases a third problem may arise - **our master DB server is getting too many TCP write requests**. This problem can be incorporated within the replication system by creating multiple master servers (that still each have a replica of the full DB) to write to. Based on the users' demographics, some users may be assigned one master server and some another master server. Then, we can have synchronization in the background to ensure the information in each server is consistent across our system by having a mechanism to updates writes from one server into another such that any conflicts can be resolved (for e.g., we may say the last written value is the correct one). By keeping different users assigned to different servers, we can reduce write requests' load on any one server while minimizing write write conflicts.

Now, if all these mechanisms have been exhausted but the system still experiences slow write issues, we then perform sharding. Sharding essentially horizontally partitions tables and places each partition on a different DB server. This has a major implication that while with pure partitioning we can still perform transactions on the partitioned table, _but with sharding, we cannot perform transactions on the whole table_ we can perform transactions on any single table shard, but the whole table doesn't allow transactions to be performed as if it were on a single DB server. This is mainly because **ACID properties are difficult to support when a table is spread across multiple DB servers**. We loose the `commit` and `rollback` capabilities.

At this point, say a client needs to update some value for customer `100`. The client will have to calculate which DB server (shard) to access for this customer, establish a TCP connection to that shard and then run the query.

#### Case Study: Youtube DB Design Evolution

Youtube ran into a similar problem. They initially used a MySQL database with multiple mechanisms discussed above such as indexing, partitioning and replication, but when eventually the writes became very slow, they had to perform sharding.

So far, we have discussed **application level sharding, where the client is aware of the shard**. Youtube also initially used this sharding. This sharding is disadvantageous as it introduces a coupling between the client and the DB.

> Good software systems have very low coupling between individual modules.

This posed its own problems. As the data in Youtube's DB grew, they felt the need to perform **re-sharding (like re-hashing; when the amount of data goes up, more shards are added and data is redistributed, with optionally each shard storing more data than it did before)**. Now, this is an issue. If Youtube changes the data-to-shard mapping (a consequence of re-sharding), the rules will have to be updated in each client, otherwise the client would not be able to access the data, and essentially the app won't play videos.

To work around this problem, they created a technology called [Vitess](https://vitess.io/). This is a middleware. We send our query to it and it works on top of MySQL to decide which shard to access by parsing the query. Essentially, it decouples the Youtube client apps and the DB sharding logic.

This shows that software systems must be carefully planned and developed accoring to the need of our system. And specifically for DBs, that sharding introduces a lot of complexities. While middleware such as Vitess can help, there are always costs associated with any technology and software. Therefore, sharding should only be used as a last resort when _writes_ are slow even after replication.

## Concurrency Control

### Shared vs. Exclusive Locks

**Exclusive locks** can be thought of as completely reserving some value (row, column or table). While an exclusive lock is in place, no other transaction is allowed to read, write or update data on the locked entity. Essentially, the transaction that has an exclusive lock is the only one to which those values are accessible. This is usually done before writing to values.

**Shared locks** (aka read locks) are used to ensure some value cannot be changed for the duration of the lock. A value under a shared lock can be read by any transaction but not updated or written to. A transaction usually acquires a shared lock before reading a value. At any given time, multiple transactions may acquire a shared lock on the same data.

When we try to acquire an exclusive lock, there must not be any shared lock or exclusive lock on the value. Whereas when we try to acquire any shared lock an a value, there must be no prior exclusive lock, although there might be other shared locks.

> Locking comes into play when multiple transactions try to read _and_ update the same value. If there were different values or if the only operation required was reading, locking wouldn't be required. Locks are a way to remove the concurrency related inconsistencies such as the [read phenomena](#read-phenomena).

Example of a transaction that acquires a lock: (`test` is a table with only one column, the primary key.)

```sql
begin transaction;
  insert into test values(20);
commit;
```

This transaction in general would acquire an exclusive lock on the row it inserted into the table `test`. The moment the insertion is successful, the lock will be released, and a message like `INSERT 1` will be shown.

The following shows another example of locking in DBs:

```sql
T1: begin transaction;
T1: insert into test values(20);
T1: --- INSERT 0 1
T2: begin transaction;
T2: insert into test values(20);
T2: --- // No insert done yet, as T1 has an exclusive lock on the row it inserted into `test` and here, we are trying to insert another row with a duplicated primary key. T2 waits for T1 to commit or rollback (i.e., to release the lock).
T1: commit;
T1: --- COMMIT // locks released
T2: --- Error: duplicate kay value violates unique constraint.
```

Here, the row inserted by `T1` remains as it acquired a lock first.

```sql
T1: begin transaction;
T1: insert into test values(20);
T1: --- INSERT 0 1
T2: begin transaction;
T2: insert into test values(20);
T2: --- // No insert done yet, as T1 has an exclusive lock on the row it inserted into `test` and here, we are trying to insert another row with a duplicated primary key. T2 waits for T1 to commit or rollback (i.e., to release the lock).
T1: rollback;
T1: --- ROLLBACK // locks released
T2: --- INSERT 0 1
```

Here, the row inserted by `T2` remains as `T1`'s duplicated row got rolled back and the lock got released.

#### Advantages

These locks help us maintain consistency, especially in systems such as banks and configuration systems (we only want people reading the latest configuration and not old or inconsistent configurations).

#### Disadvantages

Using locks has the effect of reducing concurrency.

There are changes transactions would fail because locks couldn't be acquired.

### Deadlocks

This is a situation where two or more transactions are circularly waiting on each other for releasing their locks on some set of resources or data, with the effect that none can proceed.

Most DBs catch deadlocks and fail one or more transactions involved in the deadlock. Usually, the transaction that causes a deadlock is rolled back.

Consider an example: (`test` is a table with only one column, the primary key.)

```sql
T1: begin transaction;
T1: insert into test values(20);
T1: --- INSERT 0 1
T2: begin transaction;
T2: insert into test values(21);
T2: --- INSERT 0 1
T2: insert into test values(20);
T2: --- // No insert done, as for the primary key value of `20`, T1 has an exclusive lock. T2 waits for T1 to release the lock.
T1: insert into test values(21);
T1: --- // No insert done, as for the primary key value of `21`, T2 has an exclusive lock. T1 waits for T2 to release the lock.
T1: --- // Postgres detects this transaction is waiting for another transaction (T2), that is waiting for this transaction. It detects a deadlock and rolls this transaction back.
T1: --- Error: deadlock detected. Rollback initiated. // locks released
T1: --- ROLLBACK
T2: --- INSERT 0 1 // The row T2 was inserting gets inserted finally, as T1 was failed by the DB.
```

### Two - Phase Locking and The Double Booking Problem

This is the idea of acquiring DB locks and releasing them in phases. The process is to acquire all locks first, and then start releasing them, however acquiring locks is not allowed once releasing of locks begins.

This also gives a solution to the **double-booking problem** (the same resource being acquired a lock on by 2 transactions at the same time).

Consider the following example: (`seats` is a table having the booking status of various seats in a cinema.)

```sql
T1: begin transaction;
T1: --- BEGIN
T2: begin transaction;
T2: --- BEGIN
T1: select * from seats where id = 13;   --- check the status of seat no. 13
T1: --- | id = 13 | isbooked = 0 | name = NULL |
T2: select * from seats where id = 13;   --- check the status of seat no. 13 (concurrently with T1)
T2: --- | id = 13 | isbooked = 0 | name = NULL |
--- Now, both transactions know that seat 13 is available.
T1: update seats set isbooked = 1, name = "Abc" where id = 13;   --- T1 books the seat first.
T1: --- UPDATE 1
T2: update seats set isbooked = 1, name = "Xyz" where id = 13;   --- T2 books the same seat next, overriding T1's previous booking. (due to unrepeatable read phenomenon; had T2 now checked the status of seat 13, it would have come as booked (depending on isolation level).)
T1: commit;
T1: --- COMMIT
T2: --- UPDATE 1
T2: commit;
T2: --- COMMIT   // Now, T1's booking is gone, and overridden by T2.
```

The example above shows the double booking problem - 2 transactions saw the same data to be updatable, at the same time, with the effect that both updated the data to their individual new values, with the further effect that only the last update will persist, and the first one ignored, while the constraint that the data could be updated only once is violated.

The concept of two-phase locking prevents the double booking problem. The following example demonstrates the fact:

```sql
T1: begin transaction;
T1: --- BEGIN
T2: begin transaction;
T2: --- BEGIN
T1: select * from seats where id = 13 for update;   --- T1 not only gets the status of seat 13, but also obtains an exclusive lock on it (via the `for update` clause). **Phase 1: Acquire locks**
T1: --- | id = 13 | isbooked = 0 | name = NULL |
T2: select * from seats where id = 13 for update;   --- T2 tries to get the status of seat 13, but is blocked untill T1 releases its lock on the tuple. (Here, the result would have been the same even if no lock was acquired, i.e., if the `for update` was missing, as T1 has an _exclusive_ lock.)
T1: update seats set isbooked = 1, name = "Abc" where id = 13;   --- T1 books the seat first.
T1: --- UPDATE 1
T1: commit;   --- **Phase 2: Release locks**
T1: --- COMMIT  // locks released by T1
T2: --- | id = 13 | isbooked = 1 | name = 'Abc' |  // exclusive lock acquired by T2 (Phase 1: Acquire locks)
T2: commit;   --- Seat already booked, nothing to do.
T2: --- COMMIT  // locks released by T2.
```

> The `for update` clause is only supported in some databases, not all, as it provides a row-level lock.

> There is a **lock timeout** present in various databases, where if a transaction waits for a lock for more than a specified amount of time, it gets aborted.

### Alternative Solution to the Double Booking Problem [Pitfall Warning]

An other approach to solve the double booking problem is to update first, then check the result:

```sql
T1: begin;
T1: --- BEGIN
T2: begin;
T2: --- BEGIN
T1: update seats set isbooked = 1, name = "Abc" where id = 13 and isbooked = 0;   --- Implicit exclusive lock acquired by T1 on the row.
T1: --- UPDATE 1
T2: update seats set isbooked = 1, name = "Xyz" where id = 13 and isbooked = 0;   --- Waits for the lock by T1 to be released on the row. Here is an IMPORTANT POINT - while T1 had already updated the row in question to have `isbooked` equal to `1`, T2 still was able to fetch that row using `isbooked = 0` (and then realize it is locked, leading to blocking of T2). This is because T1 and T2 are _isolated_ (here, to the default level of `read committed`), and the changes made to the row by T1 are invisible to T2 untill T1 commits. From postgres' perspective, when T1 made the update, a new tuple for the row was created as the most recent version, and the row itself was locked. Then, when T2 tried accessing the row, the older tuple was used as the new tuple's changes weren't committed yet, leading to the correct row's older version being fetched. Then, on checking it was found that this row was locked by another transaction, leading to blocking of T2.
T1: commit;
T1: --- COMMIT   // PITFALL WARNING: At this point, we are essentially at the MERCY OF THE DB IMPLEMENTATION! There is a possibility that once T1 commits, it releases the lock on the row of seat 13, BUT T2 is _still_ under the impression that for seat 13 `isbooked = 0`. This is wrong, as now `isbooked` was set to `1` by a transaction that has been committed, therefore, the same must reflect in T2's `update` query's `where` clause, and NO update must be made. Essentially, the `update` query of T2 must rerun, and the old row shouldn't be changed, as that would still lead to double booking. (The `read committed` isolation level is NOT a guarantee that the value of `isbooked`, or that of the previous fetch will be refreshed to the newly committed values. The isolation level's only responsibility is to prevent reading of uncommitted values.)
T2: --- UPDATE 0   // Postgres ensures that any changes done to rows become visible to all transactions waiting for those rows to be freed, preventing the pitfall.
```

> We used postgres in the above example. With other DBMSes, we might see an issue with this sort of approach, as DBs are implemented differently from one another. In postgres, essentially what happened above was that the lock information was stored along with the row's data in the heap. When T2 went to the row, it saw the row to be locked and entered a blocking mode. Now, when T1 committed, T2 got unblocked. While the row was already identified, postgres ran the `where` clause of the `update` once more on the (now updated) row to check in case the row had changed. This "refresh" allowed postgres to find that the `where` predicate was no longer `true`, and therefore the row wasn't re-updated.
>
> This is an implementation-dependent effect, and therefore this solution is not guaranteed to work across DB engines. (Although most DBs are pessimistic and _will_ perform some sort of a refresh.)

This solution uses an implicit lock, the previous one used an explicit lock. In general, as long as we are using locks, explicit ones are easier to analyse, as there isn't any "background" implicit stuff ocurring.

## SQL Pagination Best Practice - Avoid `Offset`

Consider a news web application with an API that supports pagination (arranging rows into separate groups to prevent fetching too many at any given time. We may have 3 pages, each with 10 rows and a fourth with 6 rows. We then may fetch page 2 or 3 or some other).

Say we want to get 10 records from page 10. Assumming each page has 10 records, we want to start from the 100th record and get 10 more, like so: (`id` field is sequential, so newer rows will get newer ids.)

```sql
select title
from news
order by id desc
offset 100
limit 10;
```

Offset means "fetch and drop rows". Therefore, the above query will first fetch 110 rows, and then drop the first 100. As the offset goes up, the DB has to perform more work.

There is another issue. Say we now want page 11, with an offset of `110`. But, a new row has been inserted already in the first `109` rows (somehow, esp. if `id` weren't sequential), pushing the `110th` row one forward. The end result will be that while the user saw row `110` on page 10, they will see it again on page 11. It will be read twice.

The time overhead in fetching many rows doesn't seem large, but imagine an offset of `100000`. In that case, `100010` rows will have to be fetched, causing significant overhead. Some DBs such as SQL Server acquire a shared lock on `select` queries implicitly, which if acquired on `100010` rows may lead to lock escalation (increasing the scope of the lock), causing a shared lock to be placed on the entire table, preventing any other updates as well.

A better way to perform pagination would be more focussed on the client side. The client can first query the DB to get some `id` (or timestamp), and then based on the timestamp, the client can decide the next 10 or previous 10 `id`s. So, if the last `id` we saw was `1240`, and we want 10 more `id`s after it, we may query as follows:

```sql
select title
from news
where id > 1240
order by id desc
limit 10;
```

If there was an index on `id`, this query will be much faster, and will not depend on any offset. (Overhead down from O(n) rows to O(1) rows.)

Note here that the `limit` clause also helps the DB here, as the DB had an upper limit on how many rows to pull.

> Avoid `offset`, while `limit` is fine and beneficial to use.

## Connection Pooling in DBs

Connection pooling is a pattern of creating a pool of available connections (usually TCP) and allowing multiple clients to share this pool of connections. This is particularly useful when connection establishment, security and removal are expensive, as is the case in DBs. This is also useful when the server has a limited number of DB connections, but a lot of clients.

The old way of connecting to a DB server is:

1. A `GET` request is made to a (web?) server.
2. The server establishes a connection to the DB server. (A TCP connection made this way involves a 3-way handshake, and is therefore expensive.)
3. The server then executes the relevant query.
4. The server gets the result and closes the connection to the DB. (Closing the connection - another expensive task on the OS side.)
5. The server finally returns the data.

This occurs in every request.

The way pooling can be done, using the `pg` library, is:

```js
const app = require("express")();
const { Pool } = require("pg");

// Create a pool when the server is started.
const pool = Pool({
  host: "domain-or-ip-address-of-db-server",
  port: 5432, // Usual Postgres port
  user: "postgres",
  password: "postgres",
  database: "name-of-db",
  max: 20, // Max number of allowed connections
  connectionTimeoutMillis: 10, // How long a wait is permissible if no pool connection is available right now. `0` means wait forever.
  idleTimeoutMillis: 10, // How long to wait before closing unused open connections.
});

app.get("/get-data", async (req, res) => {
  const queryString = "...";

  const results = await pool.query(queryString);

  res.send(results);
});
```

> We can also ask the pool to allocate a dedicated connection to us in case a long, multi-query transaction is to be run.

## Database Replication

**Master/Backup Replication**: In this form of DB replication, we have one master node that accepts writes and DDL operations (i.e., schema operations such as `create table`). There are also various read-only backup nodes that receive the changes from the master node. This is a simple form of replication as it has no conflicts - there is one node that takes writes, and the rest are read-only.

Usually, the changes are made by a client to the master node. The master node has bi-directional TCP connections to all backup nodes. Using these connections, the master node updates the backup nodes.

For reads, we can read the master for the most recent data, but we can also read the backup nodes. There can be an eventual consistency model, where the clients see the updates to master later than when the master update committed.

A major benefit of replication is horizontal scalability _for reads_.

A modification to this mechanism is **multi-master replication**. Here, multiple master nodes exist that accept writes or DDL operations. One or more backup nodes have to receive the writes from the master nodes. One drawback of this design is conflict resolution. There can be various forms of conflicts arising out of different kinds of (conflicting) writes/DDLs to different masters. This system can be considered for _write scalability_, but is tricky to implement.

**Synchronous replication** means that when a client issues a write to the master replica, it will have to wait until the write has been written to the backup/standby nodes as well. Some DBs have clauses such as waiting for the change to be written to the first 2 replicas, first replica, or any of the replicas. Here, we get full consistency instead of eventual consistency, as the client can only unblock once all relevant replicas _and_ the master have committed.

> The set of synchronously updating servers is called a **cluster**.

**Asynchronous replication** means that a write is considered successful if it is written to the master. However, the DB has to apply the writes to the other DBs (backups) in the background. This increases the write throughput, but now we only have eventual consistency. Also, there is more processing required for the background processes.

> Generally, synchronous replication is preferred over asynchronous replication.

### Demo

The process for replication is slightly involved. Basically, we first create DB servers (here, 2). Then, we assign one server to be the master and the others to be backups. Finally, we make the master aware of the backups and vice versa.

For the demo, we will use Postgres 13, and create 2 DB servers on docker.

First, create the 2 DB systems, with external volumes (for manual edits, present [here](./replication_demo/)) as follows:

```bash
docker run --name pmaster -p 5432:5432 -v 'full/path/to/master_data:/var/lib/postgresql/data' -e POSTGRES_PASSWORD=postgres -d postgres
docker run --name pstandby -p 5433:5432 -v 'full/path/to/standby_data:/var/lib/postgresql/data' -e POSTGRES_PASSWORD=postgres -d postgres
```

Then, we stop both the master and the standby DBs:

```bash
docker stop pmaster pstandby
```

and copy the data of master into standby:

```bash
mv standby_data standby_data_bk # Make a backup of standby's data
cp -R master_data standby_data  # Copy master's data into standby
```

Now, we perform the following update _only_ in the [master_data](./replication_demo/master_data/):

```bash
cd ./master_data
code pg_hba.conf  # Open this .conf file in any text editor.
# Add this line: `host replication postgres all md5   # postgres here is the user, with admin priveledges. In actual DBs, make a dedicated user with only required priveledges.` at the end of the file.
cd ..
```

Now, we will perform a similar edit in the [standby_data](./replication_demo/standby_data/):

```bash
cd ./standby_data
code ./postgresql.conf  # Open this .conf file in any text editor.
# Enable and edit the line: `primary_conninfo = 'application_name=standby1 host=<IP address of host> port=<port of host> user=<host username> password=<host password>'			# connection string to sending server`
cd ..
```

Now, create a file called `standby.signal` in the standby_data folder, to mark it a standby instance.

Now, go back to master_data and edit the file `postgresql.conf` by adding the line:

```conf
synchronous_standby_names = 'first 1 (standby1)'
```

Now, in the logs for the master server, the following line can be seen:

```
LOG:  standby "standby1" is now a synchronous standby with priority 1
```

Now, to test, we can run the following command:

```bash
docker exec -it pmaster psql -U postgres
```

to interact with the master server. The following command displays the replication status:

```sql
select * from pg_stat_replication;
```

Now, if we created a table in master:

```sql
create table test (id int, name varchar(200));
```

it will also be visible via `\d` in standby. However, if we try creating a table in the standby, we'll get the following:

```sql
pstandby: create table t1(id int);
-- ERROR:  cannot execute CREATE TABLE in a read-only transaction
```

### Advantages and Disadvantages of Replication

A major benefit of replication is that we get horizontal scalability. With usual replication we can scale reads, while with multi-master replication we can scale our writes too.

> As it is tricky, multi-master replication must be the second-last resort when designing a DB system (sharding being the last resort).

We can also place all backup replicas in different regions and have region-based queries. This allows the DB server to be physically close to the client. As DB protocols and the underlying TCP involve a large amount of network traffic, reduction in the amount that a packet has to travel helps reduce networking delays.

> "Keep your applications close, and your DB closer."

A drawback of replication is eventual consistency. Whereas in some cases such as likes on a post the exact number doesn't matter, but in other applications eventual consistency might pose problems.

In case of synchronous writes, based on the configuration (`first 1`, `first 2`, etc.), the writes may be slower.

Moreover, a multi-master replication is difficult to implement.

## Twitter Database System Design

Here, we'll design a basic twitter-like system that has the following **high level features**:

1. Users can post tweets upto 140 characters.
2. Users can follow people.
3. There should be a home timeline for users (a stream of Tweets from accounts a user has chosen to follow on Twitter).

Based on this, we can assess some **technical requirements**. One is that we'll need to identify users, and therefore need authentication. Also, we'll need a DB to store tweets in. We'll take a relational DB.

We will place a DB in our system, but we'll also have clients. As it is unspecified as yet, we can choose a web based client that uses HTTP. We will also require a layer between the client and the DB, which will be our web server, using a ReST architecture.

Say the client wants to post a tweet. In that case, the client will send a post request (assumming authentication is done) with the data in the request body. This will go to the web server.

Based on this, the server now will send an `insert` statement to the DB, in the DB's protocol. So, if we chose postgres, the server will use postgres wire protocol. Once the insert is complete, the DB will respond to the server, and the server can accordingly inform the client of success or failure in posting the message.

Here, we have various possibilities to improve the design. For example, if the DB `insert` fails, the server can try to insert the query again and again. In this time, the client will be waiting, and can be simply informed that the tweet was successful, even though the actual content isn't in the DB yet. The server could place the request in a message queue and insert it in the DB later. The moment the request is placed in the queue, it is to be considered as posted.

In any case, connection with the DB or with MQs on the backend are best pooled, as that way we can prevent any TCP connection establishment lag.

Once the tweet persistence issue is dealt with, we have another issue. When the client sends a `POST` request to the backend, there is a possibility that the request failed. In this case, if the user was shown an error, but the tweet was lost, it would lead to a bad UX. One way to solve this problem is to create a local DB on the client side, and when the client posts a tweet, send it to the backend _and_ save it in parallel to the local DB. Now, in case the POST failed, we could place the tweet in a **drafts section**. Now, the user can be asked to try again once the connection is back up. We could also setup auto retry.

Now, for the purpose of scaling, we could introduce a load balancer between the client and the server. One way this could be done is that we have multiple servers (with different domains and addresses) and the client is aware of the various servers. Next, the client randomly chooses one of the multiple servers and POSTs to that server. This client-level load balancing has the advantage that no other layer is required, but the disadvantage is that the client needs to be aware of the servers.

A more natural way would be to use a proper load balancer between the clients and the web servers. A layer 7 load balancer (reverse proxy) would be the point of contact where each client will post to the load balancer, and the load balancer itself will route the request to one of the web servers.

> A **reverse proxy** makes a request on behalf of a client, so that the server doesn't know the identity of the client.

With the load balancer, at the server side of the balancer, we might want to use HTTP/2 instead of ReST, with the effect that any message sent from the load balancer to any of the servers will be on the same TCP connection, requiring lesser handshakes and file descriptors.

Had we used ReST on the load balancer side, there would have been a problem of running out of TCP connections quickly, as the load balancer proves to be a bottleneck.

We could use L4 load balancing (transparent proxy), where each client is mapped to a single fixed server. In this case, the TLS handshake between the server and the client is needed only once, even for multiple requests, thus speeding up the process.

Now, to follow people, there must be a profile to follow. We can consider a table with `id`, `name`, `picture` and `bio`. We need a structure that can tell us which person follows whom. In a NoSQL DB, we could create a list of followers. In a relational DB, however, we could consider a table with 2 columns, `SID` (source id) and `DID` (destination id). It essentially means that SID is following DID.

This means that the table will grow huge. We could create a multi-index on the table. As there are going to be very few requests to this table (because people follow limited number of people), we can use a B<sup>+</sup> tree for an index.

To follow someone, all that is needed is a POST request having both the IDs, making the request an extremely lightweight one.

We might want to list an ID's followers. First, we can consider how to get the count of followers. We could perform a `count()` with the relevant ID in the `where` clause. We'll have 2 queries - one to get the number of followers, and another to get the number of followings. We could create a mechanism where we want both the counts and get every row where the ID appears either in SID or in DID. Finally, we can at the server separate the counts as follower or following. The approach to count at the server and the approach to perform 2 queries and let the DB count are both valid, but they must be tested to check which is faster.

In the 2-query approach, we also can list the followers and the followings. Now, in Twitter, we can view the count of followers and followings, and then we can, on a different screen, optionally view the lists. If the lists are to be cached from the query after the count is found, the backend will need to access the cache and not query the DB the next time. If the cache is in the DB, it can be sufficiently large to support multiple users.

However, there is a problem. If our backend uses REST, it is stateless and we loose the connection to the cached entry the moment we respond the the query for the counts. One solution could be making the backend stateful, using gRPC, for example.

One more task is to check if a user follows another user (to enable the follow button). For this, we could query the followers' table, but as we were already querying the profiles (to view a profile), an extra querying of another table just to show a profile screen is a slow operation. We could perform the second (is following?) query in parallel asynchronously to get the result later, but display the profile first.

## DB Engines [aka Storage engines, Embedded Databases]

These are software libraries that DBMSes use to perform low-level storing of data on disk and CRUD operations. They can be as simple as key-value stores or highly complex libraries that support ACID transactions and transactions with foreign keys.

Various DBs initially used to be monoliths, but recently there has been a separation of duties into multiple modules. So, tasks such as server management can be performed separately from tasks of DB engines. Also, anyone creating a new database software can use DB engines and prevent having to create all software from the start.

DBMSes can use a DB engine and build features on top, such as servers, replication, isolation, stored procedures, etc.

Some DBMSes such as MySQL and MariaDB give us the flexibility to switch engines. Others such as Postgres come with a built-in engine which can't be changed.

### MyISAM

**ISAM** stands for Indexed Sequential Access Method.

Here, indexes (B-Trees) point directly to rows. This means that indexes point to the exact offset on disk where the row resides, providing fast access.

However, this engine does not support transactions, and ACID properties are not supported. However, a layer above this engine can be used to implement the ACID properties.

This engine is open source and is owned by Oracle.

In this engine, inserts are fast as new data is always appended to the end of the heap (table file), but updates and deletes are problematic. The reason of updates and deletes being slow is that when rows are deleted, or updated to change the row size, all the rows after the changed row need to be moved to new locations. This means that all indexes (that point to row offsets) need to now be updated.

In this engine, if a DB crashes in the middle of a transaction, the table gets corrupted and needs to be _manually_ repaired before it can be used again. The repair generally involves correcting the indexes' row offsets. There is a repair utility that can perform repairs when necessary.

This engine supports table level locking, but not row-level locking. This can slow down writes in case we have concurrent users.

MySQL, MariaDB, PerconaDB (a fork of MySQL) support MyISAM.

This engine used to be the default engine for MySQL.

### InnoDB

This DB engine replaces MyISAM as the default engine for MySQL and MariaDB. It uses B<sup>+</sup>-Tree indexes, that point to the primary key instead of the row offset, and the primary key points to the row. Therefore, a primary key is required in InnoDB, as opposed to MyISAM, where its not required. In case a table is made without a primary key, the engine creates a sequential primary key. The 2-level access (index to primary key and primary key to row) is slightly slower than MyISAM, but prevents any updation to indexes post row updates/deletes.

This engine also supports ACID compliant transactions and foreign keys.

This engine also supports **tablespaces**, which are a way to specify in which storage drive will a table be stored (all tables of one tablespace go in the same drive).

This engine also supports row-level locks and spatial operations (operations involving coordinates).

This engine is owned by Oracle.

### XtraDB

This is a fork of InnoDB created to remove the dependency from Oracle. It was the default for MariaDB untill ver. 10.1, however, 10.2 onwards, MariaDB switched the default to InnoDB as XtraDB couldn't be kept up to date to the features of InnoDB.

> The system tables in MariaDB use the Aria DB engine (no transactions) 10.4 onwards.

### SQLite

This DB engine was created by D. Richard Hipp in 2000. It is a very popular embedded database for local data (in client side applications, browsers, OSes, etc.).

This engine uses B-Trees by default and allows using LSM trees as an extension.

The syntax used is Postgres-like. The engine supports full ACID and table level locking, but not row level locking. (This works as generally there is only a single user for local data.)

The DB engine allows for concurrent reads and writes.

Web SQL in browsers supports SQLite, and it is included in many operating systems by default.

### Aria

This DB engine was created by Michael Widenius. It is similar to MyISAM, but unlike MyISAM, it is crash-safe and it is not owned by Oracle.

It was designed specifically for MariaDB (in which since ver. 10.4, all system tables use Aria).

### BerkeleyDB

It was developed by Sleepycat Software in 1994 and is now owned by Oracle. It is a key-value embedded DB that supports ACID, locks, replications etc.

This engine used to be used in bitcoin core (but is now replaced by LevelDB).

This engine was used is MemcacheDB (NOT memcached).

### LevelDB

It was written by Jeff and Sanjay from Google in 2011. The goal was to develop a DB engine that has fast inserts, esp. for SSDs.

The issue was that B-Trees require $O(\log{n})$ time for rebalancing. This engine uses LSM (log structured merge) trees, that have $O(1)$ insert time complexity. Also, B-Tree rebalancing requires _updates_ to bytes on disk, which is harmful to SSDs.

This engine does not support transactions.

The idea here is to insert new information and read old information, but not perform deletes or updates as much. Therefore, systems that use this should be designed to minimize the number of deletes.

This engine was inspired by Google BigTable.

This DB is called levelDB as it has levels. The first level is `memtable` (in-memory data store that is made durable using WALs). The next level is `level 0, aka young level`. The levels then proceed from `level 1` to `level 6`, increasing in size. As files grow large, levels are merged.

This engine is used in bitcoin core blockchain, minecraft and AutoCad.

### RocksDB

Facebook forked LevelDB in 2012 to create RocksDB. This engine has a lot of extra features, such as ACID transactions. This engine has a higher performance and uses a multi-threaded compaction technique for increasing the level of a data file.

A fork of RocksDB called MyRocks is used in MySQL, MariaDB and Percona. Another fork, MongoRocks is used for MongoDB.

### Demo - Using different DB engines in MySQL

First, when running mySQL, `create database test` and `use test`. This will create a new DB called `test`, and switch us into it.

We can view all engines using:

```sql
show engines;
```

Now, we create a MyISAM table:

```sql
create table employess_myisam (id int primary key auto_increment, name text) engine = myisam;
```

And an innoDB table:

```sql
create table employess_innodb (id int primary key auto_increment, name text) engine = innodb;
```

The code [here](./engines_demo/index.js) is used to connect to the DB and run 2 transactions, one on each table, and the results are shown.

If we put a breakpoint on the `INSERT` transaction in MyISAM function, and see, before the transaction commits, the status of the MyISAM table, we will still see the record inserted. This goes against the read committed isolation level. That's because MyISAM does not support transactions. All queries are automatically committed. There's no rollback.

> The above test was done using JS here, but could equivalently be done from a sql terminal.

The same transaction when run on the innoDB table will implement the isolation level of read committed, as innoDB supports ACID transactions.

## Database Cursors

Consider that we are working with queries that involve lots of results. While in general this is a bad idea, some use cases require using large result sets. In a database, one crude implementation of data fetching could be querying the DB to retrieve the result set (which is a costly operation), transmitting this result set to the client (large amount of network traffic) and finally, the client should have enough memory to save the result set (impractical in many cases).

We could instead use cursors. They are a way of fetching data from the DB, based on a query plan, one element at a time, on demand. Essentially, we retrieve the data in small, manageable chunks, thus allowing ease of work.

To create cursors, we need a transaction (`begin` clause needs to be used). The following code shows how to create cursors:

```sql
begin;
declare c cursor for select id from grades where g between 90 and 100;
-- The above statement declares a cursor for the specified query. It comes up with an execution plan for the query, without actually fetching any rows.
fetch c;
-- This command returns the _next_ row from the cursor, using the query plan developed by the query. It can be executed any number of times, and each time it will give the next row (or an empty set, in case no more rows are left).
fetch last c;
-- This command returns the _last_ row of the cursor. In certain cases (such as when a backward index scan was performed), it can be fast while in other cases, the DB has to scan through all the cursor entries.
```

### Advantages and Disadvantages

A major advantage of cursors is that we save memory on our client side process (such as a backend server) that queries a DB. We can fetch a few rows (say 100), process them, perform a memory cleanup and repeat the process. Another advantage is that we can perform streaming. When data is fetched via cursors, some rows can be fetched, sent over a socket or gRPC connection and then the process can be repeated. A third advantage is that we can cancel a cursor operation mid way. Say our work could be done in the first 1000 rows, but the cursor is still not exhausted. We could simply `rollback` at this point without any issues. (Without that, a lot of time, memory and bandwidth would have been wasted.) Cursors can be used to implement some form of paging.

A disadvantage of cursors is that they are stateful. This means that there is memory allocated in the database for the cursor, and a transaction points to the cursor, with the cursor being a property of the transaction. This in turn means that cursors cannot be shared across processes. Another disadvantage is long running transactions. Cursors are used via transactions. If the cursor is used for a long time, the transaction persists for a long time as well. This is detrimental to a DB as they cannot perform indexing effectively, and DDL statements cannot run on a table if some transaction is connected to it. Also, had any shared locks been acquired, write operations could be blocked. Moreover, if the client doesn't close the cursor, it can lead to memory leakage on the DB.

### Server side cursor vs. client side cursor

The execution of a query in general follows the following 3 steps:

1. **Planning**: The database parses and determines the optimum path of execution based on many factors including table statistics, cached variables, etc. to decide what indexes to use or whether to perform a join or whether to hit the table directly.
2. **Execution**: The database executes the query plan, does any sorting that needs to be done and determines the result, but doesn’t actually fetch, or perform IO, to retrieve the result.
3. **Fetching**: The DB fetches the result and returns it to the client.

Most of the time is required in steps 2 and 3, but step 3 can be really slow if a large set of results is to be returned. This is where server side cursors become useful. The cursors we have discussed so far were server side cursors. When created, they perform steps 1 and 2, but only perform step 3 when a `fetch` command is received. Therefore, while lesser client-side memory is needed, fetching in server-side cursors takes longer.

On the other hand, client side cursors are a usual DB query. They fetch all the data at once. They are beneficial when we know beforehand that the result returned will be small. This prevents any extra memory usage on the DB side (for the cursor), or any network latencies (for the `fetch` commands). Therefore, when a client-side cursor is used to _execute_ a query, all results are fetched at the same time, making any further fetches very quick, as the data is already in the process' memory.

Essentially, client-side cursors store data on the client, and server-side cursors store data on the server (plus any required IOs).

> [This](./cursor-demo/) directory presents an example usage of client side and server side cursors.

An advantage of a client side server is that we can minimize the overhead on the DB server. However, a drawback is that a lot of network bandwidth will be consumed in fetching the data. Also, the client may now have enough memory to process the data.

Server side cursors place the overhead of processing on the server, relieving the client of managing high amounts of data. They can cause a high amount of server overhead in case lots of connections start using them. They also introduce the risk of memory leakage on the DB server. However, for tasks such as ETL or other one-off tasks, they can be very useful.

Production applications can usually benefit from client side cursors, as they don't generally involve fetching a lot of data for the client.

## Homomorphic Encryption

Encryption (specifically symmetric encryption) is the process of converting plaintext data into unreadable ciphertext, using a key, called symmetric key. This same key is needed to decrypt the text.

However, not every use case allows encryption of data. Firstly, plaintext `where` clauses in queries cannot work on encrypted data in DBs, unless the DB decrypts the data first. Decrypting the data can become difficult as we scale operations. It will be an unnecessary overhead, and complications of key management will arise. Moreover, table analysis, indexing and tuning cannot be performed on encrypted data. Also, applications receiving the encrypted data have to decrypt it using a shared key. This gives rise to trust management complications, as a key can only be shared with trusted applications. Also, in a different use case, layer 7 load balancers need to decrypt TLS encrypted data to understand the request and route it to some server. However, many people oppose this decryption as it exposes the data just for the purpose of routing it.

Homomorphic encryption gives us the ability to perform arithmetic operations on encrypted data, without decrypting it. This allows us to query a DB that is encrypted, and also perform indexing and other optimizations on encrypted data. Also, Layer 7 load balancers' rules can be formed on the encrypted data traffic itself.

While there are privacy based advantages, a major drawback is that currently, homomorphic encryption is very slow.

> This can be very useful in cloud providers, where an organisation may simply give encrypted data to the provider.

The IBM Homomorphic Encryption is an ongoing project that is available [here](https://github.com/IBM/fhe-toolkit-linux).

While this technology is not currently production ready, due to its slowness, it can be used in asynchronous operations, where response time isn't an issue.

## MongoDB Architecture

MongoDB is a document based NoSQL database. It is famous for its schema-less way of writing code.
