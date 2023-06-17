const axios = require('axios');
const querystring = require('querystring');

module.exports.spotifyArtist = (req, res) => {
    axios.post('https://accounts.spotify.com/api/token', `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
    {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(token => {
        console.log(token.data.access_token);
        axios.get(`https://api.spotify.com/v1/artists/1t20wYnTiAT0Bs7H1hv9Wt?si=Nx_F-DWJSOCf7pJ15DSzkQ`,
        {headers: {Authorization: `Bearer ${token.data.access_token}`}})
        .then(artist => {
            console.log(artist.data);
            res.status(200).json(artist.data);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json(err));
}

module.exports.spotifyUserLogin = (req, res) => {
    const params = {
        client_id : process.env.CLIENT_ID,
        response_type : 'code',
        redirect_uri : 'http://localhost:3000',
        scope : 'user-follow-read user-top-read user-read-recently-played',
        state : generateState()
    }
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify(params));
}

const generateState = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let state = '';
    
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        state += characters.charAt(randomIndex);
    }
    
        return state;
};