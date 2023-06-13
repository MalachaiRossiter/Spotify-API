const axios = require('axios');

module.exports.spotifyArtist = (req, res) => {
    axios.post(`https://accounts.spotify.com/api/token', 'grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(artist => {
        console.log(artist);
        res.status(200).json(artist.data);
    })
    .catch((err) => {console.log(err)});
}