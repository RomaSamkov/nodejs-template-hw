const filePath = require('./filePath');
const fs = require('fs/promises');

const updateProducts = async products => {
  await fs.writeFile(filePath, JSON.stringify(products));
};

module.exports = updateProducts;
