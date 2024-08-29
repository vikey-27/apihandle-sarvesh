const bodyParser = require('body-parser');
const express=require('express')
const mongoose=require('mongoose')
const Detail=require('./models/details')
const HttpError=require('./models/http-error');
require('dotenv').config();

const app=express();


app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
  });

  app.get("/", (req, res) => res.send("Express on Vercel"));
app.get('/api/get-request',async (req,res,next)=>{
    let result= await Detail.find();
    if(result.length == 0) {
        return next(new HttpError('No data is Found',404));
    }
    res.send(result)

})

app.post('/api/post-request',async (req,res,next)=>{
    const {name,description,title,price}=req.body;
    const createDetail= new Detail({
        name,description,title,price
    });
    let existingname=await Detail.findOne({name});
    if(existingname)
    {
        return next(new HttpError('name is already present',409))
    }
   let result = await createDetail.save()
   console.log(result)
   if(!result)
   {
    return next(new HttpError('List not added',409))
   }
  res.send({ message: "List added successfully",id:result.id });

})


mongoose.connect('mongodb+srv://sarveshwars321:AR0VnUMIstowBfs0@cluster0.oq2xn.mongodb.net/sarvesh?retryWrites=true&w=majority&appName=Cluster0').then(()=>{
    app.listen(3030,()=>{console.log('Server ready on the PORT')});
}).catch((err)=>{
    console.log(err);
})


module.exports = app;

