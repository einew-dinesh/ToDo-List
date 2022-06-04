const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const tasks =[];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){

  var today = new Date();
  var options ={
    weekday : "long",
    day :"numeric",
    month:"long"
  };

  var day = today.toLocaleDateString("en-US",options);

  res.render("list",{
    kindOfDay : day,
    newtasks : tasks
  });


});

app.post("/",function(req,res){

  var task =req.body.task;
  tasks.push(task);
  res.redirect("/");

});

app.listen(3000,function(){
  console.log("server started");
})
