const axios = require('axios');

module.exports.spotifyArtist = (req, res) => {
    axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials&client_id=e8707217fb8b4cdd98c6bd135fd412a6&client_secret=0642fcfadc1d4862b479b9a04ba31c23',
    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(artist => {
        console.log(artist);
        res.status(200).json(artist.data);
    })
    .catch((err) => {console.log(err)});
}