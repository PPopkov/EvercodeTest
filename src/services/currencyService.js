const { NotFoundError } = require("../errors/NotFoundError");
const { ValidationError } = require("../errors/ValidationError");

function createCurrencyService(repository) {
  return {
    getAll: () => repository.getAll(),
    getById: (id) => {
      const currency = repository.getById(id);
      if (!currency) throw new NotFoundError("Currency not found");
      return currency;
    },
    getByTicker: (ticker) => {
      const currency = repository.getByTicker(ticker);
      if (!currency) throw new NotFoundError("Currency not found");
      return currency;
    },
    create: (name, ticker) => {
      if (!name || !ticker)
        throw new ValidationError("The name and ticker fields are required");
      if (typeof name !== "string" || typeof ticker !== "string")
        throw new ValidationError(
          "The name and ticker fields must be strings."
        );
      const newCurrency = repository.createCurrency(name, ticker);
      return newCurrency;
    },
    update: (id, name, ticker) => {
      if (typeof name !== "string" || typeof ticker !== "string")
        throw new ValidationError(
      "The name and ticker fields must be strings."
    );
    const currency = repository.getById(id);
    if (!currency) throw new NotFoundError("Currency not found");
    return repository.updateCurrency(id, name, ticker);
    },
    remove: (id) => {
      repository.deleteCurrency(id);  
      return true;
    },
  };
}

module.exports = {
  createCurrencyService,
};
