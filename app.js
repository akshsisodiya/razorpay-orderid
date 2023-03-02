var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require('cors');
const bodyParser = require('body-parser')
const paymentConfirmedController = require('./controllers/paymentConfirmedController')
const orderIdController =  require('./controllers/orderIdController')
const client =  require('./databasepg.js')


var app = express();
app.use(cors({
  origin: '*',
}))
// app.use(logger("dev"));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))





app.get("/", async(req, res)=>{
  res.send("Hello")
})


app.post("/order-id", orderIdController);

app.post("/payment-callback", paymentConfirmedController)

client.connect()

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
