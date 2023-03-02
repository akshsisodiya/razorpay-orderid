const uniquId = require("uniquid");
const Razorpay = require("razorpay");
const client  = require("../databasepg.js")
const supabase = require("../lib/client.js")
let orderId;

var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

async function orderIdController(req, res){
    
    let cart
    try{
        cart = await JSON.parse(req['body'])
    } catch(e){
        cart = req['body']
    }
    console.log(cart)
    
    var options = {
        amount: cart.total*100,
        currency: "INR",
        receipt: uniquId(),
    };

    instance.orders.create(options, async function (err, order) {
        if (err) {
        console.log(err)
        res.status(400).json({message: "here it went wrong", err:""});
        } else {
        orderId = order.id;
        const {data, error} = await supabase.from('Orders').insert([{uid: cart.uid, total: cart.total, events:cart.events, order_id: orderId}])
        if(error){
            res.status(400)
        }
        console.log(orderId)
        res.status(200).json({ order_id: orderId });
        }
    });
}

module.exports = orderIdController