const db = require('../models/models')
const bcrypt = require('bcrypt')

const userController ={}

const workFactor = 10;

userController.create = (req, res, next) => {
  console.log(req.body);
  const { name, password } = req.body;
  const username = name;
    bcrypt
    .hash(password, workFactor)
    .then(hash => {
        console.log('line 13', hash)
        const query = `UPDATE users 
        SET hashedpassword = '${hash}' 
        WHERE username = '${username}';`
        db.query(query)
          return next();
        })
        .catch((err) => {
          return next({
            log: `Error in userController.create:', ${err}`,
            message: { err: 'Error occured in userController.create' }
          })
        })
};

userController.login = (req, res, next) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return next({
      log: `Error in userController.login, please enter username and password:', ${err}`,
      message: { err: 'Error occured in userController.login' }
    });
  }
  //query database for hashed password of passed in username
  const query = `SELECT hashedpassword
  FROM users  
  WHERE username = '${name}';`
  db.query(query)
  .then((data) => {
  bcrypt
  .compare(password,data)
  })
  .then((result) => {
      if (result){
        return next();
      }
      else{
        //Discuss with Niko and Jordan what to do if password is wrong, and redirect or response accordingly
        return next();
      }
    })
    .catch((err) => {
      return next(
        {
          log: `Error in userController.login:', ${err}`,
          message: { err: 'Error occured in userController.login' }
        }
      );
    })
  };

module.exports = userController;