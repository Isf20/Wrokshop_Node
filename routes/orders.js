var express = require("express");
var router = express.Router();
var Order = require("../models/OrderItem.model");
var Product = require("../models/OrderProduct.model");
const multer = require("multer");
const { status } = require("express/lib/response");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, new Date().getTime + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

/**แสดงรายการ product มาทั้งหมด */
/* GET all Product*/
router.get("/api/v1/products", async function (req, res, next) {
  let products = await Product.find({});
  console.log(products);
  const data = {products};
    res.status(200).json({
    message: "All Product ",
    data: data,
  });
});

/**Post Add Product*/
router.post("/api/v1/products", async function (req, res, next) {
  try {
    let { ProductName, Size, ClothingColor, Inventory } = req.body;
    let products = new Product({
      ProductName: ProductName,
      Size: Size,
      ClothingColor: ClothingColor,
      Inventory: Inventory,
    });
    await products.save();
    console.log(products);
    const data = {products};
    res.status(200).json({
      message: "Seve",
      data: data,
    });
  } catch (error) {
    console.error(error);
    const data = {products};
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

/**Put Update Product*/
router.put("/api/v1/products/:id", async function (req, res, next) {
  try {
    let { ProductName, Size, ClothingColor, Inventory } = req.body;
    let { id } = req.params;
    let products = await Product.findByIdAndUpdate(
      id,
      { ProductName, Size, ClothingColor, Inventory },
      { new: true }
    );
    console.log(products);
    const data = {products};
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    const data = [];
    console.error(error);
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

/**Delete Product*/
router.delete("/api/v1/products/:id", async function (req, res, next) {
  try {
    let { id } = req.params;
    let products = await Product.findByIdAndDelete(id);
    console.log(products);
    const data = {products};
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    const data = {products};
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

/* GET เลือกดู 1 product*/
router.get("/api/v1/products/:id", async function (req, res, next) {
  let { id } = req.params;
  let products = await Product.findById(id);

  const data = {products};
  res.status(200).json({
    message: "Product",
    data: data,
  });
});

/**Post อันนี้คือ เพิ่ม Order ใน product  */
router.post("/api/v1/products/:id/orders", async function (req, res, next) {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      const data = {product};
      return res.status(400).json({
        message: "ไม่พบสินค้า",
        data: data,
      });
    }

    if (product.Inventory <= 0) {
      const data = {product};
      return res.status(400).json({
        message: "สินค้าหมด",
        data: data,
      });
    }

    let { Quantity, PriceOrder } = req.body;

    if (product.Inventory < Quantity) {
      console.log(`สินค้าเหลือ ${product.Inventory} ชิ้น`);
    }

    product.Inventory -= Quantity;
    console.log(product);
    await product.save();

    let OrderItem = new Order({
      product: product._id,
      Quantity: Quantity,
      PriceOrder: PriceOrder,
    });

    await OrderItem.save();
    let populatedOrderItem = await OrderItem.populate({
      path: "product",
      select: "ProductName Size ClothingColor",
    });

    console.log(populatedOrderItem);
    const data = {populatedOrderItem};
    res.status(200).json({
      message: "success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    const data = {populatedOrderItem};
    res.status(400).json({
      message: "Error",
      data: data,
    });
  }
});

/**Get แสดง order ทั้งหมดใน product */
router.get("/api/v1/products/:id/orders", async function (req, res, next) {

    let { id } = req.params;
    let orderitem = await Order.find({ product: id }).populate({
      path: "product",
      select: "ProductName Size ClothingColor",
    });
    console.log(orderitem);
    const data = {orderitem};
    res.status(200).json({
      message: "product",
      data: data,
    });
});

/**Get แสดง order ทุกรายการ */
router.get("/api/v1/orders", async function (req, res, next) {
    let orderitem = await Order.find().populate({
      path: "product",
      select: "ProductName Size ClothingColor",
    });
    console.log(orderitem);
    const data = {orderitem};
    res.status(200).json({
      message: "product",
      data: data,
    });
});
module.exports = router;
