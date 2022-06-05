const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();
const basicTasks =[];
const workTasks =[];


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get("/",function(req,res){

  let head = date.getDate();
  res.render("list",{
    heading : head,
    newtasks : basicTasks,
    typeList: "basic"
  });

});

app.get("/work",function(req,res){

  let head = "Work";
  res.render("list",{
    heading : head,
    newtasks : workTasks,
    typeList: "working"
  });

});

app.post("/",function(req,res){
console.log(req.body);
  var task = req.body.task;
  if(req.body.typeTask == "basic"){
    basicTasks.push(task);
    res.redirect("/");
  }else if(req.body.typeTask == "working"){
    workTasks.push(task);
    res.redirect("/work");
  }



});




app.listen(3000,function(){
  console.log("server started");
})
