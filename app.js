var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const Razorpay = require("razorpay");
const uniquId = require("uniquid");
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser')

var app = express();

// app.use(logger("dev"));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
    origin: '*',
}))

let orderId;

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.get("/", async(req, res)=>{
  res.send("Hello")
})


app.post("/order-id", async (req, res) => {
  let cart
  try{
    cart = await JSON.parse(req['body'])
  } catch(e){
    cart = req.body
  }
  console.log(cart.total)
  
  var options = {
    amount: cart.total,
    currency: "INR",
    receipt: uniquId(),
  };

  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err)
      res.status(400).json(err);
    } else {
      orderId = order.id;
      console.log(orderId)
      res.status(200).json({ order_id: orderId });
    }
  });
});

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
