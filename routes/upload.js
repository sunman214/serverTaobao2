const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

//we will upload image on cloudinary
cloudinary.config({ 
    cloud_name: 'wukongsunman', 
    api_key: '954159438923917', 
    api_secret: 'd48bjvym-cquv_e6UTJlsZuJo40' 
  })

//upload image only admin can use
router.post('/upload',auth,authAdmin,(req,res)=>{
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0) return res.status(400).json({msg: 'No file were uploaded'})

        const file = req.files.file
        if(file.size > 1024*1024) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: 'Size too large'})
        }
        if(file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') return res.status(400).json({msg: 'File format is not incorrect'})

        cloudinary.v2.uploader.upload(file.tempFilePath, {folder: 'test'}, async(err,result)=>{
            if(err) throw err
            removeTmp(file.tempFilePath)
            
            res.json({public_id: result.public_id, url: result.secure_url})
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
})

// Delete image
router.post('/destroy',auth, authAdmin, async(req, res)=>{
    try {
        const {public_id} = req.body
        if(!public_id) res.status(400).json({msg: 'No image selected'})

        cloudinary.v2.uploader.destroy(public_id, async(err,result)=>{
            if(err) throw err
            res.json({msg: 'Deleted Image'})
        })
    } catch (error) {
        return res.status(500).json({msg: error.message})
    }
})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if(err) throw err
    })
}
module.exports = router