// here we will write all our backend codes
const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect('mongodb+srv://raviegupta:LCCSeTCVaEuDn293@cluster0.cfuoowm.mongodb.net/e-comm')

// API creation
app.get('/', (req, res)=>{
    res.send('Our Express App is running')
})

app.listen(port, (errr)=>{
    if(!errr) console.log("Server Running on Port " + port);
    else console.log("Error: " + errr)
})

// Image storage engine
const storage = multer.diskStorage({
   destination: './upload/images',
   filename: (req, file, cb)=>{
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
})
const upload = multer({storage:storage})

// Creating upload Endpoint for images
app.use('/images', express.static('upload/images'))

app.post('/upload', upload.single('product'), (req, res)=>{
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
}) 


// Schema for creating Products
const Products = mongoose.model('Product', {
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },
})

// Creating API for adding Products
app.post('/addproduct', async (req, res)=>{
    let products = await Products.find({});
    let id;
    if(products.length>0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id=1;
    }

    const product = new Products({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });

    console.log(product);
    await  product.save();
    console.log('saved');

    res.json({
        success:true,
        name:req.body.name,
    })
})

// Creating API for deleting Products
app.post('/removeproduct', async (req, res)=>{
    await Products.findOneAndDelete({id:req.body.id});
    console.log('removed');

    res.json({
        success: true,
        name: req.body.name
    })
})

// Creating API for getting all Products
app.get('/allproducts', async (req, res)=>{
    let products = await Products.find({})
    console.log('all products fetched');
    res.send(products);
})