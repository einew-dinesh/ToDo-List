const express = require('express');
const bodyParser = require('body-parser');

const app = express();


app.use(bodyParser({extended:true}));


app.get("/",function(req,res){

  res.send("Hey");
});


app.listen(3000,function(){
  console.log("server started");
})
