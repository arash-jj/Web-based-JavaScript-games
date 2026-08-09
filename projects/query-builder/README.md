# Query Builders for SQL and MongoDB

> A flexible, fluent query builder library supporting both SQL (PostgreSQL/MySQL) and MongoDB, with parameterized queries and a unified execution interface.

## 🎯 About

This project implements two elegant query builders that let you construct complex database queries programmatically using a fluent, chainable API. It includes:

- **`SQLQueryBuilder`** – builds parameterized SQL queries for `SELECT`, `INSERT`, `UPDATE`, and `DELETE` with support for `WHERE`, `ORDER BY`, `LIMIT`, `OFFSET`, and `IN` clauses.
- **`MongoQueryBuilder`** – builds MongoDB query objects with filtering, sorting, pagination, and projection.
- **`QueryRunner`** – a unified execution class that detects the builder type and runs the appropriate query (simulated in the demo).

The builders are designed to be extensible, type‑safe (with parameterized queries to prevent SQL injection), and easy to test. They are ideal for applications that need dynamic query construction based on user input or complex business logic.

## ✨ Features

- **Fluent chainable API** – method chaining for intuitive query construction
- **Parameterized SQL** – automatic parameter generation (`$1`, `$2`, …) prevents SQL injection
- **Comprehensive SQL support** – `SELECT`, `INSERT`, `UPDATE`, `DELETE` with conditions, ordering, limits, and offsets
- **MongoDB query objects** – supports comparison operators (`>`, `>=`, `<`, `<=`, `!=`, `in`), sorting, projection, and pagination
- **Unified execution** – `QueryRunner` handles both builder types seamlessly
- **Extensible** – easy to add new operators or database adapters
- **Zero dependencies** – pure JavaScript, works in Node.js and browsers (with appropriate database drivers)

## 🎯 What You'll Learn

- **Fluent interface pattern** – building readable, chainable APIs
- **Parameterized queries** – generating safe SQL with placeholders
- **Query abstraction** – representing database operations as objects
- **Adapter pattern** – unifying different database interfaces
- **Dynamic query generation** – constructing queries based on runtime conditions
- **Testing strategies** – how to unit test query builders without a real database

## 🎮 How to Use

### SQL Query Builder

```js
import { SQLQueryBuilder } from "./utils/sql-query-builder.js";

const sql = new SQLQueryBuilder();

// SELECT
const selectQuery = sql
  .select("name", "email")
  .from("users")
  .where("age", ">", 18)
  .orderBy("name")
  .limit(10)
  .toSQL();
// { text: 'SELECT name, email FROM users WHERE age > $1 ORDER BY name ASC LIMIT $2', params: [18, 10] }

// INSERT
const insertQuery = sql
  .insert({ name: "Alice", email: "alice@example.com" })
  .into("users")
  .toSQL();
// { text: 'INSERT INTO users (name, email) VALUES ($1, $2)', params: ['Alice', 'alice@example.com'] }

// UPDATE
const updateQuery = sql
  .update({ active: true })
  .from("users")
  .where("id", "=", 1)
  .toSQL();
// { text: 'UPDATE users SET active = $1 WHERE id = $2', params: [true, 1] }

// DELETE
const deleteQuery = sql
  .delete()
  .from("users")
  .where("last_login", "<", "2020-01-01")
  .toSQL();
// { text: 'DELETE FROM users WHERE last_login < $1', params: ['2020-01-01'] }
```

### MongoDB Query Builder

```js
import { MongoQueryBuilder } from "./utils/mongo-query-builder.js";

const mongo = new MongoQueryBuilder();

const query = mongo
  .collection("users")
  .where("age", ">", 18)
  .equals("active", true)
  .sort("name", 1)
  .limit(10)
  .select("name", "email")
  .toQuery();
// {
//   collection: 'users',
//   filter: { age: { '$gt': 18 }, active: true },
//   sort: { name: 1 },
//   limit: 10,
//   projection: { name: 1, email: 1 }
// }
```

### Unified Query Runner

```js
import { QueryRunner } from "./main.js";
import { SQLQueryBuilder } from "./utils/sql-query-builder.js";
import { MongoQueryBuilder } from "./utils/mongo-query-builder.js";

const runner = new QueryRunner();

const sqlBuilder = new SQLQueryBuilder()
  .select("*")
  .from("users")
  .where("active", "=", true)
  .limit(5);
await runner.run(sqlBuilder); // logs: [SQL] SELECT * FROM users WHERE active = $1 LIMIT $2 | params: [true, 5]

const mongoBuilder = new MongoQueryBuilder()
  .collection("users")
  .where("age", ">", 21)
  .sort("name", 1)
  .limit(10);
await runner.run(mongoBuilder); // logs: [Mongo] { collection: 'users', filter: { age: { '$gt': 21 } }, sort: { name: 1 }, limit: 10 }
```

## 🎨 Customization

### Adding New SQL Operators

Extend `_buildWhereClause()` in `SQLQueryBuilder` to support additional operators (e.g., `LIKE`, `BETWEEN`).

### Adding MongoDB Operators

Add new convenience methods (e.g., `greaterThanOrEqual`) that call `where()` with the appropriate operator.

### Changing Parameter Placeholders

Modify `_nextParam()` to use `?` or `@p1` style placeholders as needed for your database driver.

### Query Execution

Replace the simulated `execute()` methods with real database calls using `pg`, `mysql2`, or the MongoDB Node.js driver.

## 📁 Project Structure

```text
query-builder/
├── main.js                       # QueryRunner and demo
├── utils/
│   ├── index.js                  # Re‑exports
│   ├── sql-query-builder.js      # SQLQueryBuilder class
│   ├── mongo-query-builder.js    # MongoQueryBuilder class
│   └── (optional) ...            # Additional adapters
└── README.md                     # This file
```

## 🔧 API Reference

### `SQLQueryBuilder`

| Method                          | Description                                                      |
| ------------------------------- | ---------------------------------------------------------------- |
| `select(...fields)`             | Start a SELECT query, defaults to `*`                            |
| `insert(data)`                  | Start an INSERT query with object { field: value }               |
| `update(data)`                  | Start an UPDATE query                                            |
| `delete()`                      | Start a DELETE query                                             |
| `from(table)` / `into(table)`   | Set the table name                                               |
| `where(field, operator, value)` | Add a WHERE condition (supports `=`, `>`, `>=`, `<`, `<=`, `!=`) |
| `whereIn(field, values)`        | Add an `IN` clause                                               |
| `orderBy(field, direction)`     | Add ORDER BY (default ASC)                                       |
| `limit(num)`                    | Add LIMIT                                                        |
| `offset(num)`                   | Add OFFSET                                                       |
| `toSQL()`                       | Returns `{ text, params }` ready for execution                   |

### `MongoQueryBuilder`

| Method                          | Description                                                   |
| ------------------------------- | ------------------------------------------------------------- |
| `collection(name)`              | Set the collection name                                       |
| `where(field, operator, value)` | Add filter (operators: `=`, `>`, `>=`, `<`, `<=`, `!=`, `in`) |
| `equals(field, value)`          | Convenience for `=`                                           |
| `greaterThan(field, value)`     | Convenience for `>`                                           |
| `in(field, values)`             | Convenience for `$in`                                         |
| `sort(field, direction)`        | Sort (1 = ascending, -1 = descending)                         |
| `limit(num)`                    | Limit results                                                 |
| `skip(num)`                     | Skip results (pagination)                                     |
| `select(...fields)`             | Projection (include only these fields)                        |
| `toQuery()`                     | Returns the MongoDB query object                              |

## 🚀 Run Locally

### Node.js

```bash
node main.js
```

### In the Browser

The builders are browser‑compatible (they don't depend on Node.js core modules). You can use them with a bundler like Vite or import directly (with `type="module"`).

## 📝 License

MIT License – free to use, modify, and distribute.
