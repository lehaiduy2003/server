const calculateOrderAmount = (products) => {
  // Calculate the order total on the server to prevent people from directly manipulating the amount on the client
  return products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );
};

module.exports = { calculateOrderAmount };
