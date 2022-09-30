const { json } = require("body-parser");
var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Model = require("../models/Users");

// app.post('/profile', upload.single('avatar'), function (req, res, next) {
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// })
// Load User model
// import Buyer from "../models/Users"
// const Vendor = require("../models/Users");
// const Food = require("../models/Users");

// GET request
// Getting all the users
// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request
// Add a user to db
router.post("/edit", async (req, res) => {
  const User = req.body.details.user;
  const id = req.body.id;
  console.log(req.body, req.body.details);
  if (User === "Vendor") {
    await Model.Vendor.findByIdAndUpdate(id, req.body.details);
  } else {
    await Model.Buyer.findByIdAndUpdate(id, req.body.details);
  }
  res.status(200).send("Nice");
});

router.post("/edititem", async (req, res) => {
  const id = req.body.id;
  await Model.Food.findByIdAndUpdate(id, req.body.details);
  res.status(200).send("Nice");
});

router.post("/deleteitem", async (req, res) => {
  const id = req.body.id;
  const vid = req.body.vid;
  await Model.Food.findByIdAndDelete(id);
  await Model.Vendor.findByIdAndUpdate(
    vid,
    { $pull: { __foodID: id } },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
      }
    }
  );
  res.status(200).send("Nice");
});

router.post("/itemeditget", (req, res) => {
  const id = req.body.id;
  Model.Food.findById(id, function (err, result) {
    if (err) {
      return res.status(404).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/editget", (req, res) => {
  const User = req.body.user;
  const id = req.body.id;
  // console.log(req.body.details);
  if (User === "Vendor") {
    Model.Vendor.findById(id, function (err, result) {
      if (err) {
        return res.status(404).send(err);
      } else {
        // console.log(result);
        res.status(200).send(result);
      }
    });
  } else {
    Model.Buyer.findById(id, function (err, result) {
      if (err) {
        return res.status(404).send(err);
      } else {
        // console.log(result);
        res.status(200).send(result);
      }
    });
  }
});

router.post("/register", (req, res) => {
  userType = req.body.user;
  let newUser;
  if (userType === "Buyer") {
    newUser = new Model.Buyer({
      name: req.body.name,
      user: req.body.user,
      batch: req.body.batch,
      age: req.body.age,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });
  } else {
    newUser = new Model.Vendor({
      name: req.body.name,
      user: req.body.user,
      shop: req.body.shop,
      starttime: req.body.starttime,
      closetime: req.body.closetime,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    });
  }
  newUser
    .save()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log(err);
    });
});

router.post("/stage", async (req, res) => {
  const id = req.body.id;
  const stage = req.body.stage;
  // console.log(id, stage);
  const result = await Model.Order.findByIdAndUpdate(id, { stage: stage });
  if (!result) {
    return res.status(404).send(err);
  } else {
    // console.log(result);
    const buyer = await Model.Buyer.findByIdAndUpdate(result.__buyerID, {
      $inc: { wallet: result.price },
    });
    res.status(200).json({ result: result, buyer: buyer });
  }
});

router.post("/rating", async (req, res) => {
  const id = req.body.id;
  const rating = req.body.rating;
  console.log(rating);
  const result = await Model.Order.findByIdAndUpdate(id, {
    $set: {
      rating: rating,
    },
  });
  console.log(result);
  if (!result) {
    return res.status(404).send("Nope");
  } else {
    const food = result.__foodID;
    const x = await Model.Food.findById(food);
    console.log(x);
    if (!x) {
      return res.status(404).send("Nope");
    } else {
      const sold = x.sold + 1;
      const rate = (x.rating * x.sold + rating) / sold;
      const y = await Model.Food.findByIdAndUpdate(food, {
        rating: rate,
        sold: sold,
      });
      console.log(y);
      if (!y) {
        return res.status(469).send("Nope1");
      } else {
        res.status(200).send("AMAZING");
      }
    }
  }
});

router.post("/order", (req, res) => {
  const { __buyerID, __vendorID, __foodID, quantity, addons, price } = req.body;
  const itemname = req.body.name;
  const ptime = Date.now();
  console.log(req.body);
  const newOrder = new Model.Order({
    __buyerID,
    __vendorID,
    __foodID,
    quantity,
    addons,
    price,
    ptime,
    itemname,
  });
  newOrder
    .save()
    .then((user) => {
      Model.Buyer.findByIdAndUpdate(
        user.__buyerID,
        { $push: { orders: user._id } },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated User : ", docs);
          }
        }
      );
      Model.Vendor.findByIdAndUpdate(
        user.__vendorID,
        { $push: { orders: user._id } },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated User : ", docs);
          }
        }
      );
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log(err);
    });
});
// router.post("/newitem", upload.single("avatar"), (req, res) => {
router.post("/newitem", (req, res) => {
  const id = req.body.__vendorID;
  console.log(req.body);
  console.log(req.body.name);
  // const image = req.file.path;
  const newItem = new Model.Food({
    name: req.body.name,
    price: req.body.price,
    shop: req.body.shop,
    tags: req.body.tag,
    veg: req.body.veg,
    // image: image,
    addons: req.body.addons,
    vendorname: req.body.vendorname,
    __vendorID: id,
  });
  newItem
    .save()
    .then((item) => {
      Model.Vendor.findByIdAndUpdate(
        id,
        { $push: { __foodID: item._id } },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated User : ", docs);
          }
        }
      );
    })
    .catch((err) => {
      res.status(400).send(err);
      console.log(err);
    });
});

router.post("/buyerorders", async (req, res) => {
  const email = req.body.email;
  const user = await Model.Buyer.findOne({ email });
  if (!user) {
    console.log("No Email");
    return res.status(404).json({
      error: "Email not found",
    });
  } else {
    const items = user.orders;
    // console.log({'items' : items , name : user.name})
    var foods = [];
    for (let id in items) {
      const food = await Model.Order.findById(items[id]);
      if (!food) {
        console.log(err);
        console.log("in error");
        return res.status(404).send(err);
      } else {
        foods.push(food);
      }
    }
    // console.log(foods);
    res.status(200).json({ foods: foods });
  }
});

router.post("/vendororders", async (req, res) => {
  const email = req.body.email;
  const user = await Model.Vendor.findOne({ email });
  if (!user) {
    console.log("No Email");
    return res.status(404).json({
      error: "Email not found",
    });
  } else {
    const items = user.orders;
    // console.log({'items' : items , name : user.name})
    var foods = [];
    for (let id in items) {
      const food = await Model.Order.findById(items[id]);
      if (!food) {
        console.log(err);
        console.log("in error");
        return res.status(404).send(err);
      } else {
        foods.push(food);
      }
    }
    // console.log(foods);
    res.status(200).send(foods);
  }
});

router.post("/vendoritems", async (req, res) => {
  const email = req.body.email;
  const user = await Model.Vendor.findOne({ email });
  if (!user) {
    console.log("No Email");
    return res.status(404).json({
      error: "Email not found",
    });
  } else {
    const items = user.__foodID;
    // console.log({'items' : items , name : user.name})
    var foods = [];
    for (let id in items) {
      const food = await Model.Food.findById(items[id]);
      if (!food) {
        console.log(err);
        console.log("in error");
        return res.status(404).send(err);
      } else {
        foods.push(food);
      }
    }
    // console.log(foods);
    res.status(200).send(foods);
  }
});

router.post("/buyeritems", async (req, res) => {
  Model.Food.find({}, function (err, result) {
    if (err) {
      return res.status(404).send(err);
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  });
});

router.post("/ordersb", async (req, res) => {
  items = req.body;
  var foods = [];
  console.log(items);
  for (let id in items) {
    const food = await Model.Buyer.findById(items[id]);
    if (!food) {
      return res.status(404).send("Nope");
    } else {
      foods.push(food);
    }
  }
  res.status(200).send(foods);
});

router.post("/buyget", (req, res) => {
  const id = req.body.id;
  Model.Food.findById(id, {}, function (err, result) {
    if (err) {
      return res.status(404).send(err);
    } else {
      res.status(200).send(result);
    }
  });
});

router.post("/walletget", (req, res) => {
  const email = req.body.email;
  const user = Model.Buyer.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({
        error: "Email not found",
      });
    } else {
      res.status(200).json({ wallet: user.wallet });
    }
  });
});

router.post("/walletadd", (req, res) => {
  const id = req.body.id;
  const add = req.body.wallet;
  const user = Model.Buyer.findByIdAndUpdate(
    id,
    { wallet: add },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        console.log("Updated User : ", docs);
      }
    }
  );
});

router.post("/favsget", async (req, res) => {
  const email = req.body.email;
  const user = await Model.Buyer.findOne({ email });
  if (!user) {
    console.log("No Email");
    return res.status(404).json({
      error: "Email not found",
    });
  } else {
    const items = user.favourites;
    var foods = [];
    for (let id in items) {
      const food = await Model.Food.findById(items[id]);
      if (!food) {
        return res.status(404).send(err);
      } else {
        foods.push(food);
      }
    }
    res.status(200).send(foods);
  }
});

router.post("/favssend", (req, res) => {
  const id = req.body.id;
  Model.Buyer.findByIdAndUpdate(
    id,
    {
      favourites: req.body.favs,
    },
    function (err, result) {
      if (err) {
        return res.status(404).send(err);
      } else {
        res.status(200).send(result.favourites);
      }
    }
  );
});

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  Model.Buyer.findOne({ email }).then((user) => {
    // Check if user email exists
    if (!user) {
      Model.Vendor.findOne({ email }).then((user1) => {
        if (!user1) {
          return res.status(404).json({
            error: "Email not found",
          });
        } else {
          if (user1.password == password) {
            res.status(200).json({
              token: user1._id,
              user: "Vendor",
              name: user1.name,
              wallet: user1.wallet,
            });
          } else {
            res.status(400).send("Failed");
          }
          return user1;
        }
      });
    } else {
      if (user.password == password) {
        res.status(200).json({
          token: user._id,
          user: "Buyer",
          name: user.name,
          wallet: user.wallet,
        });
      } else {
        res.status(400).send("Failed");
      }
      return user;
    }
  });
});

module.exports = router;
