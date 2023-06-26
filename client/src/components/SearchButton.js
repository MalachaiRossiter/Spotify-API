import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SearchButton = (props) => {
    const [spotifyLink, setSpotifyLink] = useState();
    const [loaded, setLoaded] = useState(false);


    useEffect(() => {
        axios.get(`http://localhost:8000/api/spotify/userLogin`)
        .then((res) => {
            setSpotifyLink(res.data.loginLink);
        })
        .catch((err) => {console.log(err)});
    }, [])


    return(
        <div className={'search-container'}>
            <Link to={spotifyLink}>Log into Spotify</Link>
        </div>
    )
}
export default SearchButton;