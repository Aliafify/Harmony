const express = require("express");
const Parteners = require("./partenerSchema.js");
const payMethod = require("./paymentmethod.js");
const { fetchData,fetchUser, createElement, updatElement } = require("./mongoose.js");
const Partener = require("./partenerSchema.js");
const Admin = require("./adminSchema.js");
const Client = require("./clients.js");
const Worker =require("./workers.js");
const passport = require("passport");
const Router = express.Router();
const bcrypt = require("bcryptjs");
 
// get all parteners 
Router.get("/parteners", getParteners);
async function getParteners(req, res) {
  try {
    await fetchData(data => res.send(data), Parteners);
  } catch (err) {
    console.send(err);
    console.error(err);
  }
}

Router.get("/clients", getClients);
async function getClients(req, res) {
  try {
    await fetchData(data => res.send(data), Client);
  } catch (err) {
    console.error(err);
  }
}
//--- get admins accounts-----
Router.get("/admins", getAdmins);
async function getAdmins(req, res) {
  try {
    await fetchData(data => res.send(data), Admin);
  } catch (err) {
    console.error(err);
  }
}
//fetchData(data=>console.log(data),Admin);

//---------Login------------------
Router.get("/auth", async (req, res) => {
  try {

    if (req.user) {
      const id = req.session.passport.user;
      const role =req.user.user.role;
      const schemas = {"Admin":Admin,"Partener":Partener,"Worker":Worker}
      const Schema = schemas[role];
      await Schema.findOne({ _id: id }, (err, user) => {
        if (err) throw err;
        res.send({ user: user, auth: true });

      })
    }  
    else {
      res.send({ user: null, auth: false })
    }
  } catch (e) { console.send(err) }
})
Router.post("/login", auth);
function auth(req, res, next) {
  try {

    passport.authenticate("local", (err, user, info) => {
      if (err) throw err;
      if (!user) res.send("No User Exists");
      else {
        req.logIn(user, (err) => {
          if (err) throw err;
          const User = user;
          User[auth] = true
          res.send({ user: user, auth: true });
          // console.log("user", { User, auth: true });
        });
      }
    })(req, res, next);
  } catch (err) {
    res.send(err)
  }
}
//create new Partener or client or admin
//----- Admin-------
Router.post("/register/admin", createAdmin)
function createAdmin(req, res) {
  try {
    Admin.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (err) { res.send(err); console.log(err) }
      if (doc) res.send("exist");

      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new Admin({
          ...req.body,
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("User Created");
      }
    })
  } catch (err) {
    res.send(err)
  }
};
//------partener-----
Router.post("/register/partener", createNew);
function createNew(req, res) {
  try {
    Partener.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (err) { res.send(err); console.log(err) }
        if (doc) res.status(404).send("exist");

      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Partener({
          ...req.body,
          name: req.body.name,
          email: req.body.email,
          username: req.body.username,
          password: hashedPassword,
          gainDetails:[],
          bank:req.body.finance
        });
        await newUser.save();
        res.send("User Created");
        res.status(200);
      }
    })
  } catch (err) {
    res.send(err)
  }
};
//Worker
Router.post("/register/addworker", createWorker);
function createWorker(req, res) {
  try {
    Worker.findOne({ username: req.body.username }, async (err, doc) => {
      if (err) throw err;
      if (err) { res.send(err); console.log(err) }
        if (doc) res.status(404).send("exist");

      if (!doc) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Worker({
          ...req.body,
          password: hashedPassword,
        });
        await newUser.save();
        res.send("worker Created");
        res.status(200);
      }
    })
  } catch (err) {
    res.send(err)
  }
};

// --------create client--------
Router.post("/client/create", async (req, res) => {
  try {
    Client.findOne({ identification: req.body.identification }, async (err, doc) => {
      if (err) throw err;
      if (err) { res.send("err"); console.log(err) }
      if (doc) res.send("this identification exists");
      if (!doc) {
        const client = req.body
        await createElement(client, Client, Partener);
        //await updateAccording({ _id: client.partenerID }, true, false);
        await fetchUser((data)=>
        {res.status(200).send({state:"Client Created",client:data})},{identification:client.identification},Client)
             }
    })
  } catch (e) {
    res.send(e)
  }
})


//update Partener or client or admin
Router.put("/update", update);
function update(req, res) {
  try {

    const property = req.body.property; // ??
    const type = req.body.type;
    const id= req.body.id;
    if (type === "admin") {
      updatElement({ _id: id }, property, Admin);
      res.send("done");
      res.status(200);
    }
    else if (type === "Partener") {
      updatElement({ _id: id }, property, Partener);
      res.send("done");
      res.status(200);
    } 
    else if (type === "client") {
      updatElement({ _id: id }, property, Client);
      res.send("done");
      res.status(200);
    }
  } catch (err) {
    console.error(err);
  }

}
//------pay for collection-----
Router.put("/pay/collection",payCollection)
function payCollection(req,res){
  try{
    const data = req.body;
    const parteners =data.parteners;
    const clients =data.clients;
    const payLoop = (arr,schema)=>{
      for(let i = 0 ; i<arr.length ; i++){
        if(arr.role==="Partener"){
        var id = {_id:arr[i]._id};}
        if(arr.role==="Client"){
          var id ={identification:arr[i].identification};
        }
        updatElement(id,arr[i],schema);
      }
    }
    payLoop(parteners,Partener);
    payLoop(clients,Client);
    res.status(200).send("تم الدفع")
  }catch(e){ res.status(400).send(e)}
}
// --------payment methods
// add method 
Router.post("/add/paymethod",(req,res)=>{
  const method = req.body;
  createElement(method,payMethod);
  res.send("sucess");
}) 
//---get methods
Router.get("/get/paymethod",(req,res)=>{
  fetchData((data)=>{res.send(data)},payMethod)
})
const test=()=>{
  const username="test@gmail.com"
Admin.findOne({username: username }).then(user=>{
  if(!user){
 Partener.findOne({email: username }).then(user=>{
  
    if(user){
 return user      
    }  
    else{
      Worker.findOne({email: username }).then(user=>{
         user      
      })
    }  
  })
}
else{ 
   user      
  
}
}
)
}
   
module.exports = Router;  
