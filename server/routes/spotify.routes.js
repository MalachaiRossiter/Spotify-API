const SpotifyController = require('../controllers/spotify.controller');
const {authenticate} = require('../config/jwt.config');

module.exports = (app) => {
    //creates link that lets the user confirm spotify account use
    app.get('/api/spotify/userLogin', SpotifyController.spotifyUserLogin);
    //gets the account token from the user login
    app.post('/api/spotify/accountToken', SpotifyController.accountToken);
    //gets the user information with provided cookie
    app.get('/api/spotify/userInfo', authenticate, SpotifyController.userInformation);
    //checks if browser has a cookie already
    app.get('/api/spotify/cookieCheck', SpotifyController.cookieCheck);
}