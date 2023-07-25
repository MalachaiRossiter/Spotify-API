import axios from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';
import UserDisplay from './UserDisplay';

const SpotifyInformation = (props) => {
    const { spotifyTokenCode } = props;
    const [userInformation, setUserInformation] = useState();
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                //gets creates cookie holding user authenticated token
                const tokenResponse = await axios.post(`http://localhost:8000/api/spotify/accountToken`, { code: spotifyTokenCode }, { withCredentials: true });
                //uses user authenticated token to retreave their data to be displayed
                const userInfoResponse = await axios.get(`http://localhost:8000/api/spotify/userInfo`, { withCredentials: true });
                console.log(userInfoResponse.data);
                setUserInformation(userInfoResponse.data);
                // Once both requests are completed, set the loaded state to true
                setLoaded(true);
            } catch (err) {
                console.log(err);
                try {
                    const cookieCheck = await axios.get(`http://localhost:8000/api/spotify/cookieCheck`, {withCredentials: true});
                } catch (err) {
                    console.log(err);
                    navigate('/');
                }
            }
        };
        fetchData();
    }, [spotifyTokenCode]);

    return (
        loaded ? (
            <div>
                <UserDisplay userInformation={userInformation}/>
            </div>
        ) : (
            <Loading />
        )
    )
}

export default SpotifyInformation;