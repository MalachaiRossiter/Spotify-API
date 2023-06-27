import SearchButton from "./SearchButton";
import { useLocation } from 'react-router-dom';

const MainContainer = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
        return (
            <SpotifyInformation/>
        )
    }
    else {
        return (
            <SearchButton/>
        )
    }
}
export default MainContainer;