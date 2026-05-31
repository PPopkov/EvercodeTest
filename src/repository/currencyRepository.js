const { NotFoundError } = require("../errors/NotFoundError");

function createCurrencyRepository(db) {
  const self = {
    getAll: () => {
      const statement = db.prepare("SELECT * FROM currencies");
      return statement.all();
    },
    getById: (id) => {
      const statement = db.prepare("SELECT * FROM currencies WHERE id = ?");
      return statement.get(id);
    },
    getByTicker: (ticker) => {
      const statement = db.prepare("SELECT * FROM currencies WHERE ticker = ?");
      return statement.get(ticker);
    },
    createCurrency: (name, ticker) => {
      const statement = db.prepare(
        "INSERT INTO currencies (name, ticker) VALUES (?, ?)"
      );
      const id = statement.run(name, ticker).lastInsertRowid;
      return self.getById(id);
    },
    updateCurrency: (id, name, ticker) => {
      const statement = db.prepare(
        "UPDATE currencies SET name = ?, ticker = ? WHERE id = ?"
      );
      const result = statement.run(name, ticker, id);
      if (result.changes === 0) {
        throw new NotFoundError("There is no such currency");
      }
      return self.getById(id);
    },
    deleteCurrency: (id) => {
      const statement = db.prepare("DELETE FROM currencies WHERE id = ?");
      const result = statement.run(id);
      if (result.changes === 0) {
        throw new NotFoundError("There is no such currency");
      }
      return result;
    },
  };
  return self;
}

module.exports = { createCurrencyRepository };
