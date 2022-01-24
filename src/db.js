const parse = require("pg-connection-string").parse;
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

var entry = ""

async function executeTransaction(n, max, client, operation, callback) {
  await client.query("BEGIN;");
  while (true) {
    n++;
    if (n === max) {
      throw new Error("Max retry count reached.");
    }
    try {
      await operation(client, callback);
      await client.query("COMMIT;");
      return;
    } catch (err) {
      if (err.code !== "40001") {
        return callback(err);
      } else {
        console.log("Transaction failed. Retrying transaction.");
        console.log(err.message);
        await client.query("ROLLBACK;", () => {
          console.log("Rolling back transaction.");
        });
        await new Promise((r) => setTimeout(r, 2 ** n * 1000));
      }
    }
  }
}

async function insertEntry(client, callback) {
    const id = await uuidv4();  
  const insertStatement =
    "INSERT INTO SpecificationChanges (id, differences) VALUES ($1, $2);";
  await client.query(insertStatement, [id, entry], callback);
}

async function printDatabase(client, callback) {
    const selectBalanceStatement = "SELECT id, differences FROM SpecificationChanges;";
    await client.query(selectBalanceStatement, callback);
}


// Run the transactions in the connection pool
async function insert(connectionString, specificationChanges) {
  connectionString = await connectionString.replace(
      "$HOME",
      process.env.HOME
    );

  var config = parse(connectionString);
  config.port = 26257;
  config.database = "teamblueprivacymonitoring";
  const pool = new Pool(config);

  // Connect to database
  const client = await pool.connect();

  // Callback
  function cb(err, res) {
    if (err) throw err;

    if (res.rows.length > 0) {
      console.log("New account balances:");
      res.rows.forEach((row) => {
        console.log(row);
      });
    }
  }

  entry = specificationChanges;

  console.log("Insert entry");
  await executeTransaction(0, 15, client, insertEntry, cb);

  await executeTransaction(0, 15, client, printDatabase, cb);
}

module.exports = {insert};
