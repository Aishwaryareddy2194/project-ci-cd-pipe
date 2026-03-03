const express = require("express");
const app = express();

app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "UP" });
});

// In-memory "database" for products
let products = [
  { id: 1, name: "Laptop", price: 50000, stock: 5 },
  { id: 2, name: "Mobile", price: 20000, stock: 10 },
  { id: 3, name: "Headphones", price: 2000, stock: 15 },
];

// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Get single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

// Create product
app.post("/api/products", (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || !price || !stock) {
    return res.status(400).json({ message: "Name, price, and stock are required" });
  }
  const newProduct = {
    id: products.length + 1,
    name,
    price,
    stock
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
app.put("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  product.stock = req.body.stock || product.stock;

  res.json(product);
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Product not found" });

  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});

// Example route to calculate total inventory value
app.get("/api/inventory/value", (req, res) => {
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  res.json({ totalInventoryValue: totalValue });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});