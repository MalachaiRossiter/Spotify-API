import axios from 'axios';
import { useEffect, useState } from "react";
import Loading from './Loading';

const SpotifyInformation = (props) => {
    const { spotifyTokenCode: initialToken } = props;
    const [userInformation, setUserInformation] = useState();
    const [loaded, setLoaded] = useState(false);
    const [spotifyTokenCode, setSpotifyTokenCode] = useState(initialToken);

    useEffect(() => {
        // Save the token to localStorage whenever it changes
        localStorage.setItem("spotifyToken", spotifyTokenCode);

        if (spotifyTokenCode) {
            axios.post(`http://localhost:8000/api/spotify/token`, { code: spotifyTokenCode })
                .then(res => {
                    console.log(res.data);
                    setUserInformation(res.data); // Save response data
                    setLoaded(true);
                })
                .catch(err => {
                    console.log(err);
                    setLoaded(true); // Set loaded to true even on error to avoid infinite loop
                });
        }
    }, [spotifyTokenCode]);

    useEffect(() => {
        // If the initialToken (from props) is different from the one in state,
        // update the state with the initial token.
        if (initialToken && initialToken !== spotifyTokenCode) {
            setSpotifyTokenCode(initialToken);
        }
    }, [initialToken, spotifyTokenCode]);

    return (
        loaded ? (
            <div>
                <h1>Penis</h1> {/* Just a placeholder text, you can replace it with your actual UI */}
            </div>
        ) : (
            <Loading />
        )
    )
}

export default SpotifyInformation;