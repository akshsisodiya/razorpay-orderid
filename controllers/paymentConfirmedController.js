// const supabase = require('../lib/client')
const Formidable = require('formidable')
const crypto = require('crypto')
require('dotenv').config()
const Razorpay = require("razorpay");


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

async function paymentConfirmedController(req, res){
    let x = await instance.payments.fetch(req.body.razorpay_payment_id)
    console.log(x)
    let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

  var crypto = require("crypto");
  var expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
                                  .update(body.toString())
                                  .digest('hex');
                                  console.log("sig received " ,req.body.razorpay_signature);
                                  console.log("sig generated " ,expectedSignature);
  var response = {"signatureIsValid":"false"}
  if(expectedSignature === req.body.razorpay_signature)
   response={"signatureIsValid":"true"}
      res.send(response);
}

module.exports = paymentConfirmedController