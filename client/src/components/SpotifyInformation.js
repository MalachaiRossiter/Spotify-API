import axios from 'axios';
import { useEffect, useState } from "react";
import Loading from './Loading';

const SpotifyInformation = (props) => {
    const {spotifyTokenCode} = props;
    const [userInformation, setUserInformation] = useState();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        axios.post(`http://localhost:8000/api/spotify/token`, {code: spotifyTokenCode})
        .then(res => {
            console.log(res.data);
            setLoaded(true);
        })
        .catch(err => {console.log(err)})
    }, [spotifyTokenCode])

    return (
        loaded ? (
            <div>
                <h1>Penis</h1>
            </div>
        ) : (
            <Loading/>
            
        )
    )
}
export default SpotifyInformation;