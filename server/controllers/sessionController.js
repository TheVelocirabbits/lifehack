const mongoose = require('mongoose');
const Session = require('../models/sessions');

const sessionController = {};

sessionController.startSession = (req, res, next) => {
  Session.create({ cookieID: res.locals.username }, (err, session) => {
    if (err) return next({
        log: 'Error occured in sessionController.startSession.',
        status: 500,
        message: { err: 'An error occurred'},
    });
    else return next();
  });
};

module.exports = sessionController;