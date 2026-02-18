// Group by seller
const sellerGroups = {};

for (item of cart.items) {
  const product = await Product.findById(item.product).populate("seller");

  const sellerId = product.seller._id.toString();

  if (!sellerGroups[sellerId]) {
    sellerGroups[sellerId] = [];
  }

  sellerGroups[sellerId].push({
    product: product._id,
    quantity: item.quantity,
    priceAtPurchase: product.price,
  });
}

// Create order per seller
for (sellerId in sellerGroups) {
  const items = sellerGroups[sellerId];

  const totalAmount = items.reduce(
    (acc, item) => acc + item.priceAtPurchase * item.quantity,
    0
  );

  await Order.create({
    user: req.user._id,
    seller: sellerId,
    items,
    totalAmount,
    status: "paid", // or pending if payment integration
  });
}
