import {useState} from 'react';
import {Link} from 'react-router-dom';
import '../styles/UserDisplay.css';

const UserDisplay = (props) => {

    const { userInformation } = props;
    const username = userInformation.userInfo.username;
    const id = userInformation.userInfo.id;
    const images = userInformation.userInfo.images;
    const followers = userInformation.userInfo.followers;
    const currentlyPlaying = userInformation.userInfo.currentlyPlaying;
    const recommendedTracks = userInformation.userInfo.recommendedTracks;
    const topTracks = userInformation.userInfo.topTracks;
    const topArtists = userInformation.userInfo.topArtists;

    return (
        <div className={'userDisplay-container'}>
            <div className={'userDisplay'}>
                <div className={'usernameDisplay'}>
                    <h1>{username}</h1>
                    <h1>Followers: {followers.total}</h1>
                </div>
                <div className={'trackDisplay'}>
                    {topTracks.map((track, index) => (
                        <div key={index}>
                            <Link to={`https://open.spotify.com/track/${track.id}`} className='trackList'>
                                <p className={'trackNumber'}>{index+1}</p>
                                <img className={'trackImage'} src={track.albumImages[0].url} alt={'album Image'}/>
                                <div className='trackNameContainer'>
                                    <p className={'trackName'}>{track.name}</p>
                                    <p className={'trackArtist'}>{track.artists[0].name}</p>
                                </div>
                                <p className={'trackAlbum'}>{track.albumName}</p>
                                <p className={'trackPopularity'}>popularity: {track.popularity}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default UserDisplay;