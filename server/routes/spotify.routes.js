const SpotifyController = require('../controllers/spotify.controller');

module.exports = (app) => {
    app.get('/api/spotify/artist', SpotifyController.spotifyArtist);
    app.get('/api/spotify/userLogin', SpotifyController.spotifyUserLogin);
    app.post('/api/spotify/token', SpotifyController.spotifyCode);
}