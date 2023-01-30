var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Razorpay = require("razorpay");
const uniquId = require("uniquid");
require("dotenv").config();

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

let orderId;

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.get("/order-id", async (req, res) => {
  let cart = await JSON.parse(req.body)
  var options = {
    amount: cart.total,
    currency: "INR",
    receipt: uniquId(),
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      res.status(400).json(err);
    } else {
      orderId = order.id;
      res.status(200).json({ order_id: orderId });
    }
  });
});

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
