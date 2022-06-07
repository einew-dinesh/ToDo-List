const express = require('express');
const bodyParser = require('body-parser');
//const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

//connecting to mongoose database server and creating database
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});
//creating schema
const itemsSchema = {
  name : String
}
//creating model(collection)     singular name
const basicTask = mongoose.model("basicTask",itemsSchema);

const task1 = new basicTask({
  name : " Welcome to Your todoList "
});
const task2 = new basicTask({
  name : " Hit + button to add a new item "
});
const task3 = new basicTask({
  name : " <-- Hit this to delete an item "
});

const defaultTask = [task1,task2,task3];


const listSchema ={
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);


app.get("/",function(req,res){

  let head = "Today"
  basicTask.find({},function(err, foundTask){
    //let head = date.getDate();

    if(foundTask.length===0){
      basicTask.insertMany(defaultTask,function(err){
        if(err)
        console.log(err);
        else
        console.log("Added Default task Successfully");
      });
      res.redirect("/");
    }else{

      res.render("list",{
        heading : head,
        newtasks : foundTask,
        typeList: "Today"
      });
    }

  });


});

app.get("/:taskListName",function(req,res){

  let head = _.capitalize(req.params.taskListName);


  List.findOne({name: head },function(err, foundTask){
    if(!err){

      if(!foundTask){
        //creating new list if not exist
        const addList= new List({
          name: head,
          items: defaultTask
        });
        addList.save();
        res.redirect("/"+head);

      }else{
        //displaying of list
          res.render("list",{
          heading : head,
          newtasks : foundTask.items,
          typeList: req.params.taskListName
        });
      }
    }

  });
});

app.post("/",function(req,res){

  const task = req.body.task;
  const typeList = req.body.typeTask;
  console.log(req.body.typeTask);
  const addTask = new basicTask({
    name: task
  });

  if(typeList==="Today"){
    addTask.save();
    res.redirect("/");
  }else{
    List.findOne({name:typeList},function(err,foundTask){
      foundTask.items.push(addTask);
      foundTask.save();
      res.redirect("/"+typeList);
    });

  }
  // if(req.body.typeTask == "basic"){
  //   basicTasks.push(task);
  //   res.redirect("/");
  // }else if(req.body.typeTask == "working"){
  //   workTasks.push(task);
  //   res.redirect("/work");
  // }



});

app.post("/delete",function(req,res){

  const checkedTaskId = req.body.checkbox;
    const typeList = req.body.typeTask;
    if(typeList === "Today"){
      basicTask.findByIdAndRemove(checkedTaskId,function(err){
        if(err)
        console.log(err);
        else
        console.log(" Successfully deleted " + checkedTaskId);
      });
      res.redirect("/");

    }else{

      List.findOneAndUpdate(
        {name: typeList},
        {$pull:{items: {_id:checkedTaskId}}},
        function(err,foundTask){
          if(!err)
          res.redirect("/"+typeList);

        });

    }
});



app.listen(3000,function(){
  console.log("server started");
})
