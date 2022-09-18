const mongoose = require('mongoose');
const Admin = require("./adminSchema")
const Partener = require("./partenerSchema.js");
async function main() {
  await mongoose.connect("mongodb+srv://Ali_Afify:Alssultan@cluster0.ouc2r.mongodb.net/lpc?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("MongoDB-connected");
    }
  );
}

// create new element
async function createElement(object, schema1) {
  try {
    const user = await schema1.create(object);
    await user.save();
  } catch (err) {
    console.log(err)
  }
}

//get all elements of specific schema

function fetchData(callback, schema) {
  var userData = schema.find({});
  userData.exec(function (err, data) {
    if (err) throw err;
    return callback(data);
  });
};

//get one element according to property from specific schema
function fetchUser(callback, property, schema) {
  var userData = schema.findOne(property);
  userData.exec(function (err, data) {
    if (err) throw err;
    return callback(data);
  });
}

// --------update number of clients for partener------
const updateAccording = async (id, add, substract) => {
  await Partener.findOne(id).then((data) => {
    if (add) { data.clients = data.clients + 1; }
    if (substract & data.clients > 0) { data.clients = data.clients - 1; }
    data.save()
  });

}

// Updat element of specific schema
async function updatElement(id, property, schema) {
  const element = await schema.findOne(id);

  const keys = Object.keys(property);
  for (let i = 0; i < keys.length; i++) {
    element[keys[i]] = property[keys[i]]
  }
  await element.save();
}
// Delete Element 
async function deleteElement(id, schema) {
  const element = await schema.findOne(id);
  await schema.deleteOne({ name: element.name });

}

// 

module.exports = { main, createElement, fetchData, fetchUser, updatElement, updateAccording,deleteElement }
