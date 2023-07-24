const axios = require('axios');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');

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
    
    for (let i = 0; i < 32; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        state += characters.charAt(randomIndex);
    }
    
        return state;
};

// after Spotify access is granted, client sends back the code given by spotify. Then we show spotify the code, saying we have permission to access the users account
module.exports.accountToken = async (req, res) => {
    
    const existingCookie = req.cookies.accountAccessToken;
    if (existingCookie) {
        return res.json({ msg: "Cookie already exists!" });
    }

    try {
        // Step 1: Get account token from Spotify
        const params = {
            code: req.body.code,
            redirect_uri: 'http://localhost:3000',
            grant_type: 'authorization_code',
        };
        const paramsFormData = querystring.stringify(params);
        const authHeader = 'Basic ' + Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64');
        const accountToken = await axios.post('https://accounts.spotify.com/api/token', paramsFormData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': authHeader,
        }});
        const accountAccessToken = jwt.sign(accountToken.data.access_token, process.env.SECRET_COOKIE);
        res.cookie("accountAccessToken", accountAccessToken, {expires: new Date(Date.now() + 36000), httpOnly: true})
        .json({msg: "cookie obtained!"});

    } catch (err) {
      // Handle specific errors
        if (err.response && err.response.status) {
            const status = err.response.status;
            if (status === 400) {
                console.log('Bad request:', err.message);
                res.status(400).json({ error: 'Bad request.' });
            } else if (status === 401) {
                console.log('Unauthorized:', err.message);
                res.status(401).json({ error: 'Unauthorized.' });
            } else if (status === 404) {
                console.log('Not found:', err.message);
                res.status(404).json({ error: 'Not found.' });
            } else {
                console.log('Error:', err.message);
                res.status(status).json({ error: 'Something went wrong.' });
            }
            } else {
                console.log('Unexpected error:', err.message);
                res.status(500).json({ error: 'Unexpected error occurred.' });
        }
    }
};

module.exports.userInformation = async (req, res) => {
    try{
        const accountTokenData = jwt.verify(req.cookies.accountAccessToken, process.env.SECRET_COOKIE);
        // Step 2: Execute apiUserInformation, apiTracks, and apiArtists concurrently
        const [apiUserInformation, apiTracks, apiTopArtists] = await Promise.all([
        axios.get('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': `Bearer ${accountTokenData}` },
        }),
        axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { 'Authorization': `Bearer ${accountTokenData}` },
        }),
        axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { 'Authorization': `Bearer ${accountTokenData}` },
        }),
        ]);

        // Process apiUserInformation response
        const userInfo = {
            username: apiUserInformation.data.display_name,
            id: apiUserInformation.data.id,
            images: apiUserInformation.data.images,
            followers: apiUserInformation.data.followers,
        };

        // Process apiTracks response
        userInfo.topTracks = apiTracks.data.items.map(({ artists, name, popularity, album, id }) => ({
        artists,
        name,
        popularity,
        albumName: album ? album.name : 'No Album',
        albumImages: album ? album.images : 'No Album',
        id,
        }));

        // Process apiTopArtists response
        userInfo.topArtists = apiTopArtists.data.items.map(({ genres, images, name, id, popularity }) => ({
        genres,
        images,
        name,
        artistId: id,
        popularity,
        }));

        // Step 3: Get currently playing song from Spotify
        const apiCurrentlyPlaying = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { 'Authorization': `Bearer ${accountTokenData}` },
        });
        userInfo.currentlyPlaying = {};
        if (apiCurrentlyPlaying.data.is_playing) {
            userInfo.currentlyPlaying.songTitle = apiCurrentlyPlaying.data.item.name;
            userInfo.currentlyPlaying.albumName = apiCurrentlyPlaying.data.item.album.name;
            userInfo.currentlyPlaying.albumArt = apiCurrentlyPlaying.data.item.album.images;
            userInfo.currentlyPlaying.artists = apiCurrentlyPlaying.data.item.album.artists;
            userInfo.currentlyPlaying.isPlaying = apiCurrentlyPlaying.data.is_playing;
        } else {
            userInfo.currentlyPlaying.isPlaying = false;
        }

        // Step 4: Prepare data for recommendations request
        const trackIdsList = userInfo.topTracks.slice(0, 3).map(track => track.id).join(',');
        const artistIdsList = userInfo.topArtists.slice(0, 1).map(artist => artist.artistId).join(',');
        const genresList = userInfo.topArtists.slice(0, 1).reduce((genres, artist) => {
        if (artist.genres && artist.genres.length > 0) {
            genres.push(artist.genres[0]);
        }
        return genres;
        }, []).join(',');

        // Step 5: Get track recommendations from Spotify
        const queryParams = {
        limit: 3,
        seed_artists: artistIdsList,
        seed_genres: genresList,
        seed_tracks: trackIdsList,
        };
        const apiRecommendations = await axios.get(`https://api.spotify.com/v1/recommendations?` + querystring.stringify(queryParams), {
        headers: { 'Authorization': `Bearer ${accountTokenData}` },
        });
        userInfo.recommendedTracks = apiRecommendations.data.tracks.map(({ artists, album, name, popularity }) => ({
        artists,
        images: album.images,
        name,
        popularity,
    }));

    // Step 6: Send the response with the user information
    res.status(200).json({ userInfo });
    }
    catch (err){
        // Handle specific errors
        if (err.response && err.response.status) {
            const status = err.response.status;
        if (status === 400) {
            console.log('Bad request:', err.message);
            res.status(400).json({ error: 'Bad request.' });
        } else if (status === 401) {
            console.log('Unauthorized:', err.message);
            res.status(401).json({ error: 'Unauthorized.' });
        } else if (status === 404) {
            console.log('Not found:', err.message);
            res.status(404).json({ error: 'Not found.' });
        } else {
            console.log('Error:', err.message);
            res.status(status).json({ error: 'Something went wrong.' });
        }
        } else {
            console.log('Unexpected error:', err);
            res.status(500).json({ error: 'Unexpected error occurred.' });
        }
    }
};

module.exports.cookieCheck = (req, res) => {
    const accountTokenData = jwt.verify(req.cookies.accountAccessToken, process.env.SECRET_COOKIE);
    if (accountTokenData){
        res.status(200).json({cookie: true});
    } else {
        res.status(404).json({cookie: false});
    }
}