export class MongoQueryBuilder {
  constructor() {
    this._collection = "";
    this._filter = {};
    this._sort = {};
    this._limit = 0;
    this._skip = 0;
    this._projection = null;
  }

  collection(name) {
    this._collection = name;
    return this;
  }

  // ----- Filter building -----
  where(field, operator, value) {
    if (operator === "=" || operator === "==") {
      this._filter[field] = value;
    } else if (
      operator === ">" ||
      operator === ">=" ||
      operator === "<" ||
      operator === "<=" ||
      operator === "!="
    ) {
      const mongoOp = {
        ">": "$gt",
        ">=": "$gte",
        "<": "$lt",
        "<=": "$lte",
        "!=": "$ne",
      }[operator];
      this._filter[field] = { [mongoOp]: value };
    } else if (operator === "in") {
      this._filter[field] = { $in: value };
    }
    return this;
  }

  // Convenience methods
  equals(field, value) {
    return this.where(field, "=", value);
  }
  greaterThan(field, value) {
    return this.where(field, ">", value);
  }
  in(field, values) {
    return this.where(field, "in", values);
  }

  // ----- Sorting -----
  sort(field, direction = 1) {
    this._sort[field] = direction;
    return this;
  }

  // ----- Pagination -----
  limit(num) {
    this._limit = num;
    return this;
  }
  skip(num) {
    this._skip = num;
    return this;
  }

  // ----- Projection -----
  select(...fields) {
    this._projection = fields.reduce((acc, f) => ({ ...acc, [f]: 1 }), {});
    return this;
  }

  // ----- Build MongoDB query object -----
  toQuery() {
    const query = {};
    if (Object.keys(this._filter).length) query.filter = this._filter;
    if (Object.keys(this._sort).length) query.sort = this._sort;
    if (this._limit) query.limit = this._limit;
    if (this._skip) query.skip = this._skip;
    if (this._projection) query.projection = this._projection;
    return {
      collection: this._collection,
      ...query,
    };
  }

  // ----- Execute (simulated) -----
  async execute() {
    const query = this.toQuery();
    console.log(`🍃 Executing MongoDB: ${JSON.stringify(query)}`);
    // In real code: return db.collection(this._collection).find(query.filter, ...);
    return query;
  }
}

// ___DEMO___

// const mongo = new MongoQueryBuilder();
// const q = mongo
//   .collection("users")
//   .where("age", ">", 18)
//   .equals("active", true)
//   .sort("name", 1)
//   .limit(10)
//   .select("name", "email");

// console.log(q.toQuery());
// // { collection: 'users', filter: { age: { '$gt': 18 }, active: true }, sort: { name: 1 }, limit: 10, projection: { name: 1, email: 1 } }
// q.execute();
