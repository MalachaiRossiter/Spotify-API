const axios = require('axios');

module.exports.spotifyArtist = (req, res) => {
    axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials&client_id=your-client-id&client_secret=your-client-secret',
    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(artist => {
        console.log(artist);
        res(artist.data);
    })
    .catch((err) => {console.log(err)});
}