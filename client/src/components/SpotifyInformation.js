import axios from 'axios';
import { useEffect, useState } from "react";
import Loading from './Loading';
import UserDisplay from './UserDisplay';

const SpotifyInformation = (props) => {
    const { spotifyTokenCode } = props;
    const [userInformation, setUserInformation] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        console.log(spotifyTokenCode);
        axios.post(`http://localhost:8000/api/spotify/token`, { code: spotifyTokenCode })
                .then(res => {
                    console.log(res.data);
                    setUserInformation(res.data); // Save response data
                    setLoaded(true);
                })
                .catch(err => {
                    console.log(err);
                });
    }, [spotifyTokenCode]);

    return (
        loaded ? (
            <div>
                <h1>{userInformation.userInfo.username}</h1> {/* Assuming this is just a placeholder for the actual display */}
                <UserDisplay userInformation={userInformation} /> {/* Render the user information */}
            </div>
        ) : (
            <Loading />
        )
    )
}

export default SpotifyInformation;