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

## Notes

1. It is very important to always work inside the `begin transaction` and `end transaction` clauses, especially when working on a terminal in an interactive mode. This ensures we have the capability to rollback any changes we might have done, that weren't supposed to be done (such as if we forgot a `where` clause in an `update` query).

2. Ensure the primary key of a table has enough values to be able to accommodate every row. For example, if the primary key is a 4-Byte integer, it won't be able to accomodate more than ~2^32 rows.

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

If our DBMS system has only a single server, any changed committed by some transaction will be immediately available to other transactions. However, to scale our system, we require multiple nodes, caches and so on. This means that changes done to some row may take some time before they propagate to the replicas of that row.

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

Becuase DB systems need guaranteed durability, they use the `fsync` command to force the cache to be flushed. This ensures that the data is written to disk, but it makes commits very slow. So, there is a tradeoff between durability and speed.

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

