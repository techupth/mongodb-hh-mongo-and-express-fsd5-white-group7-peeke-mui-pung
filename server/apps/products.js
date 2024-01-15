import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const name = req.query.keywords;
    const category = req.query.category;
    const query = {};
    if (name) {
      query.name = new RegExp(name, "i");
    }
    if (category) {
      query.category = new RegExp(category, "i");
    }
    const collection = db.collection("products");
    const allProducts = await collection.find(query).limit(10).toArray();
    return res.json({ data: allProducts });
  } catch (error) {
    return res.json({ message: `${error}` });
  }
});

productRouter.get("/:id", (req, res) => {});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = { ...req.body, created_at: new Date() };
    const newProductData = await collection.insertOne(productData);
    return res.json({
      message: `Product Id ${newProductData.insertedId} has been created successfully`,
    });
  } catch (error) {
    message: `${error}`;
  }
});

productRouter.put("/:id", (req, res) => {});

productRouter.delete("/:id", (req, res) => {});

export default productRouter;
