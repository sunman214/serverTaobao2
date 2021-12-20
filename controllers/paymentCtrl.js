const Payments = require('../models/paymentModel')


const paymentCtrl = {
    createPayment: async (req,res)=>{
        try {
            const {customer, phone, address, cart } = req.body
            const newCustomer = new Payments({customer, phone, address, cart})
            await newCustomer.save()//save mongoose
            res.json({msg: 'order product successfully, your product will send you soon!', newCustomer})
            
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getAllPayment: async(req,res) => {
        try {
            const allPayments = await Payments.find()
            res.json({status: 'success',msg: 'thông tin đơn đặt hàng của khách',allPayments})
        } catch (error) {
            return res.status(500).json({msg: error.message});
        }
    },
}
module.exports = paymentCtrl