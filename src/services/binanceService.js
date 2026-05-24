const axios = require("axios");
const { ExternalServiceError } = require("../errors/ExternalServiceError");

const getByTicker = async (ticker) => {
  try {
    const response = await axios.get(
      `https://api.binance.com/api/v3/ticker/price`
    );
    const allPrice = response.data;
    const filtredPrice = allPrice
      .filter((item) => item.symbol.includes(ticker) && Number(item.price) > 0)
      .sort((a, b) => Number(b.price) - Number(a.price));
    return filtredPrice;
  } catch (error) {
    if (error.response) {
      throw new ExternalServiceError(`Binance error: ${error.response.status}`);
    }
    throw new ExternalServiceError("Binance is unavailable.");
  }
};

module.exports = {getByTicker};
