import axios from 'axios';
import { useEffect, useState } from "react";
import Loading from './Loading';
import UserDisplay from './UserDisplay';

const SpotifyInformation = (props) => {
    const { spotifyTokenCode } = props;
    const [userInformation, setUserInformation] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(spotifyTokenCode);
                const tokenResponse = await axios.post(`http://localhost:8000/api/spotify/accountToken`, { code: spotifyTokenCode }, { withCredentials: true });
                console.log(tokenResponse.data);
    
                const userInfoResponse = await axios.get(`http://localhost:8000/api/spotify/userInfo`, { withCredentials: true });
                console.log(userInfoResponse.data);
    
                // Once both requests are completed, set the loaded state to true
                setLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [spotifyTokenCode]);

    return (
        loaded ? (
            <div>
                <p>Placeholder</p>
            </div>
        ) : (
            <Loading />
        )
    )
}

export default SpotifyInformation;