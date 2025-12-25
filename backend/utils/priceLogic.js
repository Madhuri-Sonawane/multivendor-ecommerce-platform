const calculateDynamicPrice = ({ basePrice, stock, createdAt }) => {
  let finalPrice = basePrice;

  /* RULE 1: LOW STOCK → PRICE INCREASE */
  if (stock <= 10) {
    finalPrice += basePrice * 0.1; // +10%
  }

  /* RULE 2: OLD PRODUCT → DISCOUNT */
  const daysOld =
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);

  if (daysOld > 30) {
    finalPrice -= basePrice * 0.15; // -15%
  }

  /* RULE 3: NEVER GO BELOW 50% */
  const minPrice = basePrice * 0.5;
  if (finalPrice < minPrice) {
    finalPrice = minPrice;
  }

  return Math.round(finalPrice);
};

module.exports = calculateDynamicPrice;
