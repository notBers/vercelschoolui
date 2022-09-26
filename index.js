const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const fetch = require('node-fetch');
const bp = require('body-parser');
const mongoose = require('mongoose');
const User = require("./models/User");
const nclass = require("./models/Class");
const Group = require('./models/Group');
const message = require('./models/Message');
const Professor = require('./models/Professor');
const Assignment = require('./models/Assignment');
const UserAssignment = require('./models/UserAssignment');
const wiki = require('wikipedia')
var Dictionary = require("oxford-dictionary");


require('./connection') 
app.use(cors());

app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))

app.post('/Scholar', cors() , (req, res) => {
var results;
console.log(req.body)
async function fetchData(){
  const response = await fetch(`https://serpapi.com/search.json?${req.body.engine}q=${req.body.q}&api_key=6ea373749e00a28e4a69054b5a5a6dd835543ac87332d166f7972c0d8bb16c8b`);
  const data = await response.json();
  console.log(response);
  var tempdata = {};
  var result;
  results = [];
  switch(req.body.engine){
    case('engine=google_scholar&'):
      result = data.organic_results;
      result?.map((sult) =>{
        tempdata = {title: '', summary: '', link: '', cite_tool: '', author_id: '' };
        tempdata.title = sult.title;
        tempdata.summary = sult.publication_info.summary;
        tempdata.link = sult.link;
        tempdata.cite_tool = sult.result_id
        results.push(tempdata)
        
      })
      break
    case('tbm=isch&'):
      result = data.images_results;
      result?.map((sult) =>{
        tempdata = {image_link : '', image_source: ''};
        tempdata.image_link = sult.original;
        tempdata.image_source = sult.link;
        results.push(tempdata)
      })
      console.log(results)
      break
  }
  res.json(results)
}
fetchData()
console.log('completed')
}
)

app.post('/Cite', cors() , (req, res) => {
  var results;
  console.log(req.body)
  async function fetchData(){
    const response = await fetch(`https://serpapi.com/search.json?${req.body.engine}&q=${req.body.q}&api_key=6ea373749e00a28e4a69054b5a5a6dd835543ac87332d166f7972c0d8bb16c8b`);
    const data = await response.json();
    var tempdata = {};
    var result;
    results = [];
    try {
      result = data.citations;
      result?.map((sult) =>{
            tempdata = {format: '', cite:''};
            tempdata.format = sult.title;
            tempdata.cite = sult.snippet;
            results.push(tempdata)
            
      })  
      console.log(data)
      res.json(results)
    } catch (error) {
      res.status(404)

    }

  }
  fetchData()
  console.log('completed')
  }
  )

app.post('/RegisterUser', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await User.findOne({mail: req.body.mail});
    if(!exists){
      const newUser = new User({
      mail: req.body.mail,
      name : req.body.name,
      password: req.body.password
      })

      newUser.save((err, document) => {
        if(err) console.log(err);
        console.log('new student Created' + document)
      })

      res.json({message: "User Created"})

    }else{
      res.json({message: "User already exists"})
    }
  }

  Evaluation();
  
})

app.post('/RegisterTeacher', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await Professor.findOne({mail: req.body.mail});
    if(!exists){
      const newUser = new Professor({
      mail: req.body.mail,
      name : req.body.name,
      password: req.body.password
      })

      newUser.save((err, document) => {
        if(err) console.log(err);
        console.log('new professor Created' + document)
      })

      res.json({message: "Professor Created"})

    }else{
      res.json({message: "Professor already exists"})
    }
  }

  Evaluation();
  
})

app.post('/Login', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await User.findOne({mail: req.body.mail, password: req.body.password});
    if(exists){

      console.log('valid')
      res.json({message: 'ok'})

    }else{
      console.log('invalid')
      res.json({message: "Invalid credentials"})
    }
  }

  Evaluation();
  
})

app.post('/LoginTeacher', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await Professor.findOne({mail: req.body.mail, password: req.body.password});
    if(exists){
      res.json({message: 'ok'})

    }else{
      res.json({message: "Invalid credentials"})
    }
  }

  Evaluation();
  
})

app.post('/UserExists', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await User.findOne({mail: req.body.mail});
    if(exists){
      res.json({message: 'ok'})

    }else{
      res.json({message: "Student doesn't exists"})
    }
  }

  Evaluation();
  
})



app.post('/NewGroup', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await Group.findOne({name: req.body.name}, {Students: 1});
    if(exists){

      res.json({message: 'Group already exists'})

    }else{
      const newUser = new Group({
        name : req.body.name,
        mail: req.body.mail,
        Students: req.body.Students
        })
  
        newUser.save((err, document) => {
          if(err) console.log(err);
          console.log('new group Created' + document)
        })
      res.json({message: "Group created"})
    }
  }

  Evaluation();
  
})

app.post('/NewClass', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await nclass.findOne({name: req.body.name, Professor: req.body.Professor}, {name: 1});
    if(exists){

      res.json({message: 'Class already exists'})

    }else{
      const newUser = new nclass({
        name: req.body.name,
        Professor: req.body.Professor,
        Group: req.body.group
        })
  
        newUser.save((err, document) => {
          if(err) console.log(err);
          console.log('new class Created' + document)
        })
      res.json({message: "Class created"})
    }
  }

  Evaluation();
  
})

app.post('/GetClass', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await nclass.find({Professor: req.body.Professor}, {name: 1, Professor: 1, _id: 1});
    console.log(exists)
    res.json({message: exists})

  }

  Evaluation();
  
})

app.post('/NewAssignment', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){

      const NewAssignment = new Assignment({
        name: req.body.name,
        class: req.body.class,
        description: req.body.description,
        limit: new Date(req.body.limit)
    
        })
  
        NewAssignment.save((err, document) => {
          if(err) console.log(err);
          console.log('new assignment Created' + document)
        })
      res.json({message: "assignment created"})
    }

  Evaluation();
  
})

app.post('/ClassExists', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){

    try {

      const exists = await nclass.find({_id: req.body._id}, {name: 1, Professor: 1, _id: 1, Group: 1});
      const exists1 = await nclass.exists({_id: req.body._id}, {name: 1, Professor: 1, _id: 1, Group: 1})
      if(exists1 != null){
        
        res.json({message: exists})
      }else{
        res.json({message: 'it doesnt exists'})
      }
      
    } catch (error) {
      console.log('bad request')
      res.send({message: 'error in params'})
    }


  }

  Evaluation();
  
})

app.post('/GetAssignments', cors(), (req, res) => {
  console.log("Received assignments")
  async function Evaluation(){
    const exists = await Assignment.find({class: req.body.Class}, {name: 1, description: 1, limit: 1, _id: 1});
    console.log(exists)
    res.json({message: exists})

  }

  Evaluation();
  
})

app.post('/NewClass', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){
    const exists = await nclass.findOne({name: req.body.name, Professor: req.body.Professor}, {name: 1});
    if(exists){

      res.json({message: 'Class already exists'})

    }else{
      const newUser = new nclass({
        name: req.body.name,
        Professor: req.body.Professor,
        Group: req.body.group
        })
  
        newUser.save((err, document) => {
          if(err) console.log(err);
          console.log('new class Created' + document)
        })
      res.json({message: "Class created"})
    }
  }

  Evaluation();
  
})

app.post('/AssignmentExists', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){

    try {

      const exists = await Assignment.findOne({_id: req.body._id}, {name: 1, description: 1, limit: 1});
    

      if(exists){
        console.log(exists)
        res.json({message: exists})
      }else{
        console.log('exists')
        res.json({message: 'it doesnt exists'})
      }
      
    } catch (error) {
      console.log('bad request')
      res.send({message: 'error in params'})
    }


  }

  

  Evaluation();
  
})

app.post('/Group', cors(), (req, res) => {
  console.log("Received")
  async function Evaluation(){

    try {

      const exists = await Group.find({name: req.body.name}, {Students: 1});
      const exists1 = await Group.exists({name: req.body.name}, {Students: 1});
      
      if(exists1 != null){
        res.json({message: exists})
      }else{
        res.json({message: 'it doesnt exists'})
      }
      
    } catch (error) {
      console.log('bad request')
      res.send({message: 'error in params'})
    }


  }

  Evaluation();
  
})



app.post('/ClassesIn', cors(), (req, res) => {
  console.log('received')
  async function Evaluation(){

    try {
    const exists1 = await Group.find({Students: req.body.Students}, {name: 1});
      if(exists1){
        const exists = await nclass.find({group: {$in: exists1}}, {_id: 1, name: 1, Professor: 1});
        res.json({message: exists})
      }else{
        res.json({message: 'error in params'})
      }
      
    }catch (error) {
      console.log(error)
      res.send({message: 'error in params'})
    }


  }

  Evaluation();
  
})

app.post('/NewUserAssignment', cors(), (req, res) => {
  console.log('received')
  async function Evaluation(){

    try {
    const exists1 = await UserAssignment.exists({name: req.body.name, assignment: req.body.assignment});
    console.log(exists1)
      if(exists1 != null){
       const exist = await UserAssignment.findOne({name: req.body.name, assignment: req.body.assignment},{mark:1});

       res.json({message: 'you already uploaded this task', mark: exist.mark})
      }else{
        
        const newUpload = new UserAssignment({name: req.body.name, message: req.body.message, link: req.body.link, assignment: req.body.assignment});
        newUpload.save((err, document) => {
          if(err) console.log(err);
          console.log('uploaded' + document)
        })

        res.json('created')
      
      }
      
    }catch (error) {
      console.log(error)
      res.send({message: 'error in params'})
    }


  }

  Evaluation();
  
})

app.post('/StudentsWork', cors(), (req, res) => {
  console.log('received')
  async function Evaluation(){

    try {
    const exists1 = await UserAssignment.find({assignment: req.body.name}, {name: 1});
    console.log(exists1)
    res.json({students: exists1})
    }catch (error) {
      console.log(error)
      res.send({students: 'error in params'})
    }


  }

  Evaluation();
  
})

app.post('/StudentWork', cors(), (req, res) => {
  console.log('received')
  async function Evaluation(){

    try {
    const exists1 = await UserAssignment.findOne({assignment: req.body.name, name: req.body.username}, {message: 1, link: 1, mark: 1});
    console.log(exists1)
    res.json({students: exists1})
    }catch (error) {
      console.log(error)
      res.send({students: 'error in params'})
    }


  }

  Evaluation();
  
})

app.post('/StudentWorkMark', cors(), (req, res) => {
  console.log('received')
  async function Evaluation(){

    try {
    const exists1 = await UserAssignment.findOneAndUpdate({name: req.body.name, assignment: req.body.assignment}, {mark: req.body.mark}, {new: true});
    console.log(exists1)
    res.json({students: exists1})
    }catch (error) {
      console.log(error)
      res.send({students: 'error in params'})
    }


  }

  Evaluation();
  
})

app.post('/GetConcept', cors(), (req, res) =>{
  (async () => {
    try {
      const page = await wiki.page(req.body.page);
    
      const summary = await page.summary();
      
      res.json({response: summary.extract, responsee: summary.title})
      
    } catch (error) {
      console.log(error);
      
    }
  })();
})

app.post('/GetWord', cors(), (req,res)=>{
    var config = {
      app_id : "5c579407",
      app_key : "e6cc27d7dbeced882b15448af0e5878b",
      source_lang : req.body.lang
    };
    
    var dict = new Dictionary(config);
    
    var lookup = dict.find(req.body.word);
    

    lookup.then(function(re) {
        // stringify JSON object to see full structure in console log
      try {
        res.json({response: 'ok', word: re.id, definition: re.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]})
      } catch (error) {
        res.json({response: error})
      }
        
        
      
    },
    function(err) {
        res.json({response: 'error'})
        console.log(err);
    });
  })

app.listen(port, () => {
  console.log(`School UI listening on port ${port}`)
})

