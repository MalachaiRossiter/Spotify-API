const SpotifyController = require('../controllers/spotify.controller');

module.exports = (app) => {
    app.get('/api/spotify/artist', SpotifyController.spotifyArtist);
}