import { MongoQueryBuilder } from "./utils/mongo-query-builder";
import { SQLQueryBuilder } from "./utils/sql-query-builder";

class QueryRunner {
  async run(builder) {
    if (typeof builder.toSQL === "function") {
      const { text, params } = builder.toSQL();
      console.log(`[SQL] ${text} | params: [${params.join(", ")}]`);
      // await pool.query(text, params);
    } else if (typeof builder.toQuery === "function") {
      const query = builder.toQuery();
      console.log(`[Mongo] ${JSON.stringify(query)}`);
      // await collection.find(query.filter, ...);
    } else {
      throw new Error("Unknown query builder");
    }
  }
}

// Usage
const runner = new QueryRunner();

const sqlBuilder = new SQLQueryBuilder()
  .select("*")
  .from("users")
  .where("active", "=", true)
  .limit(5);
await runner.run(sqlBuilder);

const mongoBuilder = new MongoQueryBuilder()
  .collection("users")
  .where("age", ">", 21)
  .sort("name", 1)
  .limit(10);
await runner.run(mongoBuilder);
