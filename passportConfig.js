const Admin = require("./adminSchema.js");
const Partener = require("./partenerSchema.js");
const Worker =require("./workers.js");

const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function  (passport) {
  passport.use(
    new localStrategy((username, password, done) => {
      Admin.findOne({username: username }).then(user=>{
        if(!user){
       Partener.findOne({email: username }).then(user=>{
         if(user){
            bcrypt.compare(password, user.password, (err, result) => {
             //if (err) throw err;
             if (result === true) {
                return done(null, user);
              }  
            });
          }  
          else{
            Worker.findOne({email: username }).then(user=>{
              bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                  return done(null, user);
                } 
              });
            })
          }  
        })
      }
      else{ 
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else { 
            return done(null, false); 
          }
        });
      }
    }
    )

    })
  );
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    Partener.findOne({ _id: id },(err,user)=>{
      const userInformation = {
        user: user,
      };
      if(user){
      cb(err, userInformation);
    }
    })
    Admin.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        user: user,
      };
      if(user){ 
      cb(err, userInformation);
    }
    });
    Worker.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        user: user,
      };
      if(user){ 
      cb(err, userInformation);
    }
   
    });

  }); 
}; 
