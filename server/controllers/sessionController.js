const mongoose = require('mongoose');
const Session = require('../models/sessions');

const sessionController = {};

sessionController.startSession = async (req, res, next) => {
  console.log('res locals', res.locals);
  //Check if a session already exists in MongoDb after logIn
  const session = await Session.create({ cookieId: res.locals.username })
    try{
      // res.locals.session = session;
      return next();
    }
    catch (err) {
        if (err) return next({
            log: 'Error occured in sessionController.startSession.',
            status: 500,
            message: { err: 'An error occurred'},
        });
   
  }
};

sessionController.isLoggedIn = async (req, res, next) => {
  const {ssid} = req.cookies
  console.log(ssid)
  const result = await Session.findOne({cookieId: ssid}) 
  try {
    console.log('This is the result from Session.findOne', result);
    if (result) {
      console.log('adding hack')
      res.locals.isLoggedIn = true;
      return next();
    }
    else {
      console.log('you\'re not logged in')
      res.locals.isLoggedIn = false;
      res.status(200).json(res.locals)
    }
  }
  catch (err) {
    return next({
      log: 'Error occured in sessionController.isLoggedIn.',
      status: 500,
      message: { err: 'An error occurred'},
    })
  }
}

module.exports = sessionController;