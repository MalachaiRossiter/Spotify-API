const axios = require('axios');
const querystring = require('querystring');

// this is a test controller to understand the basics of the Spotify API
// module.exports.spotifyArtist = (req, res) => {
//     console.log('penis');
//     axios.post('https://accounts.spotify.com/api/token', `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
//     {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
//     .then(token => {
//         console.log(token.data.access_token);
//         axios.get(`https://api.spotify.com/v1/artists/06HL4z0CvFAxyc27GXpf02?si=Nx_F-DWJSOCf7pJ15DSzkQ`,
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
        scope : 'user-follow-read user-top-read user-read-recently-played user-read-currently-playing',
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
        const userInfo = {}; //creates the userInfo object that is sent back to the client
        axios.get('https://api.spotify.com/v1/me', {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}}) //gets actual User Data
        .then(apiUserInformation => {
            userInfo.username = apiUserInformation.data.display_name;
            userInfo.id = apiUserInformation.data.id;
            userInfo.images = apiUserInformation.data.images;
            userInfo.followers = apiUserInformation.data.followers;
            axios.get('https://api.spotify.com/v1/me/top/tracks', {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}}) // gets most listened to Songs
            .then(apiTracks => {
                userInfo.topTracks = apiTracks.data.items.map(({artists, name, popularity, album, id}) => ({artists, name, popularity, albumName: album ? album.name : 'No Album', id}))
                axios.get('https://api.spotify.com/v1/me/top/artists', {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}}) // gets most listened to Artists
                .then(apiTopArtists => {
                    console.log(apiTopArtists.data.items);
                    userInfo.topArtists = apiTopArtists.data.items.map(({genres, images, name, id, popularity}) => ({genres, images, name, artistId: id, popularity}))
                    axios.get('https://api.spotify.com/v1/me/player/currently-playing', {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}}) // gets currently playing song
                    .then(apiCurrentlyPlaying => {
                        //take currently playing information and add it to the userInfo
                        userInfo.currentlyPlaying = {};
                        if (apiCurrentlyPlaying.data.is_playing) {
                            userInfo.currentlyPlaying.songTitle = apiCurrentlyPlaying.data.item.name;
                            userInfo.currentlyPlaying.albumName = apiCurrentlyPlaying.data.item.album.name;
                            userInfo.currentlyPlaying.albumArt = apiCurrentlyPlaying.data.item.album.images;
                            userInfo.currentlyPlaying.artists = apiCurrentlyPlaying.data.item.album.artists;
                            userInfo.currentlyPlaying.isPlaying = apiCurrentlyPlaying.data.is_playing;
                        }
                        else {userInfo.currentlyPlaying.isPlaying = false};
                        //take information from userInfo and make it useable for the recommendations request
                        const trackIdsList = userInfo.topTracks.slice(0, 3).map(track => track.id).join(',');
                        const artistIdsList = userInfo.topArtists.slice(0, 1).map(artist => artist.artistId).join(',');
                        const genresList = userInfo.topArtists.slice(0, 1).reduce((genres, artist) => 
                        {if (artist.genres && artist.genres.length > 0) {genres.push(artist.genres[0]);}
                            return genres;
                        }, []).join(',');
                        const queryParams = {
                            limit : 3,
                            seed_artists : artistIdsList,
                            seed_genres : genresList,
                            seed_tracks : trackIdsList
                        }
                        axios.get(`https://api.spotify.com/v1/recommendations?` + querystring.stringify(queryParams),
                                {headers: {'Authorization': `Bearer ${accountToken.data.access_token}`}})
                            .then(apiRecommendations => {
                                userInfo.recommendedTracks = apiRecommendations.data.tracks.map(({artists, album, name, popularity}) => ({artists, images: album.images, name, popularity}));
                                res.status(200).json({userInfo});
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(400).json(err)
                            });
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json(err)
                    });
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json(err)
                });
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