const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const buyerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  batch: {
    type: String,
    enum: ["UG5", "UG4", "UG3", "UG2", "UG1", null],
    required: false,
  },
  wallet: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  favourites: [
    {
      type: Schema.Types.ObjectId,
      ref: "foodSchema",
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "orderSchema",
    },
  ],
});

const orderSchema = new Schema({
  itemname: {
    type: String,
  },
  __buyerID: {
    type: Schema.Types.ObjectId,
    ref: "buyerSchema",
    required: true,
  },
  __vendorID: {
    type: Schema.Types.ObjectId,
    ref: "vendorSchema",
    required: true,
  },
  __foodID: {
    type: Schema.Types.ObjectId,
    ref: "foodSchema",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  addons: [
    {
      name: String,
    },
  ],
  price: {
    type: Number,
    default: 0,
  },
  ptime: {
    type: Date,
    default: Date.now(),
  },
  stage: {
    type: String,
    enum: [
      "PLACED",
      "ACCEPTED",
      "COOKING",
      "READY FOR PICKUP",
      "COMPLETED",
      "REJECTED",
    ],
    default: "PLACED",
    required: false,
  },
  rating: {
    type: Number,
    default: -1,
    max: 5,
    required: true,
  },
});

const vendorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  shop: {
    type: String,
    unique: true,
    required: false,
  },
  starttime: {
    type: String,
    required: false,
  },
  closetime: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  __foodID: [
    {
      type: Schema.Types.ObjectId,
      ref: "foodSchema",
    },
  ],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "orderSchema",
    },
  ],
});

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  veg: {
    type: Boolean,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    required: false,
  },
  tags: [
    {
      type: String,
    },
  ],
  addons: [
    {
      name: String,
      price: Number,
    },
  ],
  sold: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  vendorname: {
    type: String,
  },
  __vendorID: {
    type: String,
    required: true,
  },
});

module.exports.Buyer = mongoose.model("Buyer", buyerSchema);
module.exports.Vendor = mongoose.model("Vendor", vendorSchema);
module.exports.Food = mongoose.model("Food", foodSchema);
module.exports.Order = mongoose.model("Order", orderSchema);
// module.exports = User = mongoose.model("Users", UserSchema);
