const cookieController = {};

cookieController.setCookie =(req, res, next) => {
    res.cookie('Not logged in cookie', 'You are not logged in', {httpOnly: true});
}

cookieController.setSSIDCookie = (req, res, next) => {
    const {username} = res.locals.data[0];
    res.cookie('ssid', username, {httpOnly: true});
    return next();
}

module.exports = cookieController;