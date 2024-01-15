import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const name = req.query.name;
  const category = req.query.category;
  const query = {};
  if (name) {
    query.name = new RegExp(name, "i");
  }
  if (category) {
    query.category = new RegExp(category, "i");
  }
  try {
    const collection = db.collection("products");
    const products = await collection.find(query).limit(10).toArray();
    return res.json({ data: products });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

productRouter.get("/:productId", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.productId);
    const product = await collection.findOne({
      _id: productId,
    });
    return res.json({ data: product });
  } catch (error) {
    return res.status(404).json({ message: "Product Not Found" });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");

    const productData = { ...req.body };
    const products = await collection.insertOne(productData);

    return res.json({
      message: `Product has been created successfully`,
    });
  } catch (error) {
    return res.status(400).json({ message: "That's an Error" });
  }
});

productRouter.put("/:productId", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.productId);
    const newProductData = { ...req.body };
    await collection.updateOne(
      {
        _id: productId,
      },
      {
        $set: newProductData,
      }
    );

    return res.json({
      message: `Product has been updated successfully`,
    });
  } catch (error) {
    return res.status(404).json({ message: "Product Not Found" });
  }
});

productRouter.delete("/:productId", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = new ObjectId(req.params.productId);
    await collection.deleteOne({
      _id: productId,
    });
    return res.json({
      message: `Product has been deleted successfully`,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot delete product because DB failed" });
  }
});

export default productRouter;
