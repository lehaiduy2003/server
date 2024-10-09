const calculateOrderAmount = (items) => {
  // Calculate the order total on the server to prevent people from directly manipulating the amount on the client
  return items.reduce((total, item) => total + item.price * quantity, 0);
};

module.exports = { calculateOrderAmount };
