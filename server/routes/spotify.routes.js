const SpotifyController = require('../controllers/spotify.controller');

module.exports = (app) => {
    // this is a test route to understand the spotify API
    // app.get('/api/spotify/artist', SpotifyController.spotifyArtist); 
    app.get('/api/spotify/userLogin', SpotifyController.spotifyUserLogin);
    app.post('/api/spotify/token', SpotifyController.spotifyCode);
}