const db = require('../models/models')
const bcrypt = require('bcrypt')

const userController ={}

const pw = 'hello';

const workFactor = 10;

userController.create = (username, password, next) => {

     
    bcrypt
    .hash(pw, workFactor)
    .then(hash => {
        console.log('line 13', hash)
        const query = `UPDATE users 
        SET hashedpassword = 'smear' 
        WHERE username = 'owl';`
        db.query(query)
          return next();
        })
        .catch((err) => {
          return next({
            log: `Error in userController.create:', ${err}`,
            message: { err: 'Error occured in userController.create' }
          })
        })
}

module.exports = userController;