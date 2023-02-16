const supabase = require('../lib/client')
const Formidable = require('formidable')
const crypto = require('crypto')

async function paymentConfirmedController(req, res){
    const form = Formidable()
    form.parse(req, async (err, fields, files)=>{
        if(fields){
            console.log(fields)
            const hash = crypto
                .createHmac('sha256', process.env.RAZORPAY_SECRET)
                .update(orderId+'|'+fields.razorpay_payment_id)
                .digest('hex')

            if(fields.razorpay_signature === hash){
                const info ={
                    payment_id: fields.razorpay_payment_id,
                    order_id: fields.razorpay_order_id
                }
                const {data:orderData, error:orderError} = await supabase.from('Orders').select('*').eq('order_id', info.order_id)
                try{
                    let orders = orderData[0]
                    let sales = await orders.map(async ({rid, coupon, order_id})=>{
                        let {data: rdata, error: rerror} = supabase.from('Registrations').eq('rid', rid)
                        let registration = rdata[0]
                        let uid = registration.uid
                        let eid = registration.event
                        return {
                            uid: uid,
                            eid: eid,
                            coupon: coupon,
                        }
                    })
                    let {data: salesData, error: salesError} = await supabase.from('Sales').insert(sales)
                    res.send('payment ok')
                } catch(e){
                    res.send('OOPS!! We forgot to store payment information, PAY AGAIN')
                }
            }
        } else {
            res.send('ERROR')
        }
    })
}

module.exports = paymentConfirmedController