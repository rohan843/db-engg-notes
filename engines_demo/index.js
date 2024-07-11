const mysql = require("mysql2/promise");

connectInnoDB();
async function connectInnoDB() {
  try {
    const con = await mysql.createConnection({
      host: "172.17.0.2",
      port: 3306,
      user: "root",
      password: "password",
      database: "test",
    });
    await con.beginTransaction();
    await con.query("INSERT INTO employees_innodb (name) values (?)", ["Tux"]);

    const [rows, schema] = await con.query("select * from employees_innodb");
    console.table(rows);

    await con.commit();
    await con.close();
    console.log(result);
  } catch (ex) {
    console.error(ex);
  } finally {
  }
}

async function connectMyISAM() {
  try {
    const con = await mysql.createConnection({
      host: "172.17.0.2",
      port: 3306,
      user: "root",
      password: "password",
      database: "test",
    });
    await con.beginTransaction();
    await con.query("INSERT INTO employees_myisam (name) values (?)", ["Tux"]);

    await con.commit();
    await con.close();
    console.log(result);
  } catch (ex) {
    console.error(ex);
  } finally {
  }
}
