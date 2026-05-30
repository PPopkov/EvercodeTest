const { NotFoundError } = require("../errors/NotFoundError");
const { ValidationError } = require("../errors/ValidationError");

function createCurrencyService() {
  const currencies = [];
  let nextId = 1;

  return {
    getAll: () => {
      return currencies;
    },
    getById: (id) => {
      const currency = currencies.find((currency) => currency.id === id);
      if (!currency) throw new NotFoundError("Currency not found");
      return currency;
    },
    getByTicker: (ticker) => {
      const currency = currencies.find((c) => c.ticker === ticker);
      if (!currency) throw new NotFoundError("Валюта не найдена");
      return currency;
    },

    create: (name, ticker) => {
      if (!name || !ticker)
        throw new ValidationError("The name and ticker fields are required");
      if (typeof name !== "string" || typeof ticker !== "string")
        throw new ValidationError(
          "The name and ticker fields must be strings."
        );
      const newCurrency = { id: nextId++, name: name, ticker: ticker };
      currencies.push(newCurrency);
      return newCurrency;
    },

    update: (id, name, ticker) => {
      const currency = currencies.find((currency) => currency.id === id);
      if (!currency) throw new NotFoundError("Currency not found");
      if (typeof name !== "string" || typeof ticker !== "string")
        throw new ValidationError(
          "The name and ticker fields must be strings."
        );
      currency.name = name;
      currency.ticker = ticker;
      return currency;
    },

    remove: (id) => {
      const index = currencies.findIndex((currency) => currency.id === id);
      if (index === -1) throw new NotFoundError("Currency not found");
      currencies.splice(index, 1);
      return true;
    },

    reset: () => {
      currencies.length = 0;
      nextId = 1;
    },
  };
}

module.exports = {
  createCurrencyService,
};
