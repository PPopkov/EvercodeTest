
function createPriceRepository(db) {
  const self = {
    getAll: () => {
      const statement = db.prepare("SELECT * FROM prices");
      return statement.all();
    },
    getById: (id) => {
      const statement = db.prepare("SELECT * FROM prices WHERE id = ?");
      return statement.get(id);
    },
    getBySymbol: (symbol) => {
      const statement = db.prepare("SELECT * FROM prices WHERE symbol LIKE ?");
      return statement.all(`%${symbol}%`);
    },
    savePrice: (symbol, price, updated_at) => {
      const statement = db.prepare(
        "INSERT OR REPLACE INTO prices (symbol, price, updated_at) VALUES (?, ?, ?)"
      );
      statement.run(symbol, price, updated_at);
    },
  };
  return self;
}

module.exports = { createPriceRepository };
