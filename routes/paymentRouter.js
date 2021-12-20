const router = require('express').Router()
const paymentCtrl = require('../controllers/paymentCtrl')

router.post('/payment', paymentCtrl.createPayment)
router.get('/payment', paymentCtrl.getAllPayment)

module.exports = router