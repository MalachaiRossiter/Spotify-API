import axios from 'axios';
import { useEffect } from "react";

const SpotifyInformation = (props) => {
    const {code} = props;

    useEffect(() => {
        axios.post(`http://localhost:8000/api/spotify/code`, {code: code})
        .then(res => {
            console.log(res.data);
        })
        .catch(err => {console.log(err)})
    }, [])

    return (
        <div>
            <h1>Penis</h1>
        </div>
    )
}
export default SpotifyInformation;