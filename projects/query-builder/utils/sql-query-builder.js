export class SQLQueryBuilder {
  constructor() {
    this._type = "select"; // select | insert | update | delete
    this._table = "";
    this._fields = ["*"];
    this._values = []; // for insert/update
    this._conditions = [];
    this._orderBy = [];
    this._limit = null;
    this._offset = null;
    this._params = []; // parameterised values
    this._paramCounter = 0;
  }

  // ----- SELECT -----
  select(...fields) {
    this._type = "select";
    this._fields = fields.length ? fields : ["*"];
    return this;
  }

  // ----- INSERT -----
  insert(data) {
    this._type = "insert";
    this._fields = Object.keys(data);
    this._values = Object.values(data);
    return this;
  }

  // ----- UPDATE -----
  update(data) {
    this._type = "update";
    this._fields = Object.keys(data);
    this._values = Object.values(data);
    return this;
  }

  // ----- DELETE -----
  delete() {
    this._type = "delete";
    return this;
  }

  // ----- FROM / INTO -----
  from(table) {
    this._table = table;
    return this;
  }
  into(table) {
    return this.from(table);
  } // for insert

  // ----- WHERE -----
  where(field, operator, value) {
    this._conditions.push({ field, operator, value });
    return this;
  }

  // Additional helpers
  whereIn(field, values) {
    const placeholders = values.map(() => this._nextParam()).join(", ");
    this._conditions.push({
      raw: `${field} IN (${placeholders})`,
      params: values,
    });
    return this;
  }

  // ----- ORDER BY -----
  orderBy(field, direction = "ASC") {
    this._orderBy.push(`${field} ${direction}`);
    return this;
  }

  // ----- LIMIT / OFFSET -----
  limit(num) {
    this._limit = num;
    return this;
  }
  offset(num) {
    this._offset = num;
    return this;
  }

  // ----- Internal helpers -----
  _nextParam() {
    this._paramCounter++;
    return `$${this._paramCounter}`;
  }

  _addParam(value) {
    this._params.push(value);
    return this._nextParam();
  }

  // ----- Build SQL -----
  toSQL() {
    let sql = "";
    this._params = [];
    this._paramCounter = 0;

    switch (this._type) {
      case "select":
        sql = this._buildSelect();
        break;
      case "insert":
        sql = this._buildInsert();
        break;
      case "update":
        sql = this._buildUpdate();
        break;
      case "delete":
        sql = this._buildDelete();
        break;
      default:
        throw new Error("Unknown query type");
    }
    return { text: sql, params: this._params };
  }

  _buildSelect() {
    let sql = `SELECT ${this._fields.join(", ")} FROM ${this._table}`;
    sql += this._buildWhereClause();
    if (this._orderBy.length) sql += ` ORDER BY ${this._orderBy.join(", ")}`;
    if (this._limit !== null) {
      sql += ` LIMIT ${this._addParam(this._limit)}`;
    }
    if (this._offset !== null) {
      sql += ` OFFSET ${this._addParam(this._offset)}`;
    }
    return sql;
  }

  _buildInsert() {
    const placeholders = this._values.map(() => this._nextParam()).join(", ");
    this._values.forEach((v) => this._params.push(v));
    return `INSERT INTO ${this._table} (${this._fields.join(", ")}) VALUES (${placeholders})`;
  }

  _buildUpdate() {
    const setClauses = this._fields.map(
      (field) => `${field} = ${this._addParam(this._values.shift())}`,
    );
    let sql = `UPDATE ${this._table} SET ${setClauses.join(", ")}`;
    sql += this._buildWhereClause();
    return sql;
  }

  _buildDelete() {
    let sql = `DELETE FROM ${this._table}`;
    sql += this._buildWhereClause();
    return sql;
  }

  _buildWhereClause() {
    if (!this._conditions.length) return "";
    const clauses = [];
    for (const cond of this._conditions) {
      if (cond.raw) {
        // Add the params from the raw condition
        cond.params.forEach((p) => this._params.push(p));
        clauses.push(cond.raw);
      } else {
        const param = this._addParam(cond.value);
        clauses.push(`${cond.field} ${cond.operator} ${param}`);
      }
    }
    return ` WHERE ${clauses.join(" AND ")}`;
  }

  // ----- Execution (simulated) -----
  async execute() {
    const { text, params } = this.toSQL();
    console.log(`🔍 Executing SQL: ${text} | params: [${params.join(", ")}]`);
    // In real code: return db.query(text, params);
    return { query: text, params };
  }
}


//  ___DEMO___

// const db = new SQLQueryBuilder();

// // SELECT
// const q1 = db.select('name', 'email').from('users').where('age', '>', 18).orderBy('name').limit(10);
// console.log(q1.toSQL());
// // { text: 'SELECT name, email FROM users WHERE age > $1 ORDER BY name ASC LIMIT $2', params: [18, 10] }

// // INSERT
// const q2 = db.insert({ name: 'Alice', email: 'alice@example.com' }).into('users');
// console.log(q2.toSQL());
// // { text: 'INSERT INTO users (name, email) VALUES ($1, $2)', params: ['Alice', 'alice@example.com'] }

// // UPDATE
// const q3 = db.update({ active: true }).from('users').where('id', '=', 1);
// console.log(q3.toSQL());
// // { text: 'UPDATE users SET active = $1 WHERE id = $2', params: [true, 1] }

// // DELETE
// const q4 = db.delete().from('users').where('last_login', '<', '2020-01-01');
// console.log(q4.toSQL());
// // { text: 'DELETE FROM users WHERE last_login < $1', params: ['2020-01-01'] }