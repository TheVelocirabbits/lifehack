const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');
const cookieController= require('../controllers/cookieController');


// parse cookies
const cookieParser = require('cookie-parser')
router.use(cookieParser());

router.get('/', (req, res) => {
  return res.status(200).send(res.locals.cookie);
})

router.get('/:category',
  apiController.getData,
  (req, res, next) => {
    res.status(200).json(res.locals.data)
  })

router.post('/', 
  apiController.makeHack, 
  (req, res, next) => {
    res.status(200).send([])
  })
//Add the sessionController.startSession middleware
router.post('/userlogin', userController.login,
=======
(req, res, next) => {
  res.status(200).json(res.locals)
})
//Add the sessionController.startSession middleware
router.post('/user',
apiController.makeUser, userController.create, sessionController.startSession, cookieController.setSSIDCookie,
(req, res, next) => {
  res.status(200).json(res.locals.data)
})

router.patch('/user',
apiController.changeUsername, 
(req, res, next) => {
  res.status(200).json(res.locals.data)
})

//** 404 handler **//
router.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

//** Global error handler **//

router.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = router
