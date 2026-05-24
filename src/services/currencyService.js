const { NotFoundError } = require("../errors/NotFoundError");
const { ValidationError } = require("../errors/ValidationError");

const currencies = [];
let nextId = 1;

const getAll = () => {
  return currencies;
};

const getById = (id) => {
  const currency = currencies.find((currency) => currency.id === id);
  if (!currency) throw new NotFoundError("Currency not found");
  return currency;
};

const create = (name, ticker) => {
  if (!name || !ticker)
    throw new ValidationError("The name and ticker fields are required");
  if (typeof name !== "string" || typeof ticker !== "string")
    throw new ValidationError("The name and ticker fields must be strings.");
  const newCurrency = { id: nextId++, name: name, ticker: ticker };
  currencies.push(newCurrency);
  return newCurrency;
};

const update = (id, name, ticker) => {
  const currency = currencies.find((currency) => currency.id === id);
  if (!currency) throw new NotFoundError("Currency not found");
  if (typeof name !== "string" || typeof ticker !== "string")
    throw new ValidationError("The name and ticker fields must be strings.");
  currency.name = name;
  currency.ticker = ticker;
  return currency;
};

const remove = (id) => {
  const index = currencies.findIndex((currency) => currency.id === id);
  if (index === -1) throw new NotFoundError("Currency not found");
  currencies.splice(index, 1);
  return true;
};

const reset = () => {
  currencies.length = 0;
  nextId = 1;
}

module.exports = { getAll, getById, create, update, remove, reset };
