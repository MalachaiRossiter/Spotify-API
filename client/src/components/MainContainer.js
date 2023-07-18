import SearchButton from "./SearchButton";
import SpotifyInformation from "./SpotifyInformation";
import { useLocation } from 'react-router-dom';

const MainContainer = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const spotifyTokenCode = queryParams.get('code');

    if (spotifyTokenCode) {
        return (
            <SpotifyInformation spotifyTokenCode={spotifyTokenCode}/>
        )
    }
    else {
        return (
            <SearchButton/>
        )
    }
}
export default MainContainer;