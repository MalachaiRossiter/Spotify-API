import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SearchButton.css';
import MovingRectangles from './MovingRectangles';

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
        <div>
            <div className={'search-container'}>
            <h1 id={'link-header'}>Unoffical Spotify Wrapped</h1>
                <Link to={spotifyLink} id={'login-link'}>
                    Link Your Spotify
                </Link>
            </div>
            <MovingRectangles />
        </div>
    )
}
export default SearchButton;