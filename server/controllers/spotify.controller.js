const axios = require('axios');
const querystring = require('querystring');

// this is a test controller to understand the basics of the Spotify API
// module.exports.spotifyArtist = (req, res) => {
//     axios.post('https://accounts.spotify.com/api/token', `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
//     {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
//     .then(token => {
//         console.log(token.data.access_token);
//         axios.get(`https://api.spotify.com/v1/artists/1t20wYnTiAT0Bs7H1hv9Wt?si=Nx_F-DWJSOCf7pJ15DSzkQ`,
//         {headers: {Authorization: `Bearer ${token.data.access_token}`}})
//         .then(artist => {
//             console.log(artist.data);
//             res.status(200).json(artist.data);
//         })
//         .catch(err => res.status(400).json(err));
//     })
//     .catch(err => res.status(400).json(err));
// }


//creates the link that gets sent back to the client to authorize the use of their spotify account
//Corse error happens when trying to reroute the client from the backend. Work around was sending the link to the front end for the client to directly go to
module.exports.spotifyUserLogin = (req, res) => {
    const params = {
        client_id : process.env.CLIENT_ID,
        response_type : 'code',
        redirect_uri : 'http://localhost:3000',
        show_dialog: true,
        scope : 'user-follow-read user-top-read user-read-recently-played',
        state : generateState()
    }
    res.status(200).json({loginLink: 'https://accounts.spotify.com/authorize?' + querystring.stringify(params)});
}

//generates the state key for the link, this helps with security as its always random
const generateState = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let state = '';
    
    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        state += characters.charAt(randomIndex);
    }
    
        return state;
};

// after Spotify access is granted, client sends back the code given by spotify. Then we show spotify the code, saying we have permission to access the users account
module.exports.spotifyCode = (req, res) => {
    const params = {
        code : req.body.code, // this is the code from spotify
        redirect_uri : 'http://localhost:3000',
        grant_type : 'authorization_code'
    }
    const paramsFormData = querystring.stringify(params);
    console.log(params);
    axios.post(
        'https://accounts.spotify.com/api/token', //gets access token from spotify which is how we access user information
        paramsFormData,
        {
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
            }
        }
    )
    .then(accountToken => {
        console.log(accountToken.data);
        const userInfo = {}; //creates the userInfo object that is sent back to the client
        axios.get('https://api.spotify.com/v1/me', {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}})
        .then(userInformation => {
            userInfo.name = userInformation.data.display_name;
            userInfo.id = userInformation.data.id;
            userInfo.images = userInformation.data.images;
            userInfo.followers = userInformation.data.followers;
            axios.get('https://api.spotify.com/v1/me/top/tracks', {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}})
            .then(topArtists => {
                console.log(topArtists.data);
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });
        })
        .catch(err => res.status(400).json(err));1
    })
    .catch(err => res.status(400).json(err));
}