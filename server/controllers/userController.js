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
  console.log(`This is the name: ${name}, and password: ${password} from req.body`)
  //need to refactor to stop the error from being sent, instead send a response back to frontend
  if (!name || !password) {
    return next({
      log: `Error in userController.login, please enter username and password:', ${err}`,
      message: { err: 'Error occured in userController.login' }
    });
  }
  //query database for hashed password of passed in username
  const query = `SELECT *
  FROM users  
  WHERE username = '${name}';`
  db.query(query)
  .then((data) => { 
    //Send username to frontend
    console.log('Data.rows from db.query on log in', data);
    res.locals.username = data.rows[0].username;
    return data.rows[0].hashedpassword
  })
  .then((hash) => {
    //console.log('This is the res.locals info', res.locals.userinfo);
    return bcrypt.compare(password,hash);
  })
  .then((result) => {
    //console.log('This is the result of querying the database for bcrypst comparison result', result);
    //Send authentication status to frontend
    res.locals.authentication = result;
    //console.log('this is res.locals: ', res.locals)
    return next();
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