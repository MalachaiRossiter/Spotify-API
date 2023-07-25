import {useState} from 'react';
import {Link} from 'react-router-dom';
import '../styles/UserDisplay.css';
import defaultImage from '../images/default-user-image.png';

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
            {/* User Profile Display */}
            <div className={'userDisplay'}>
                {images[1] ? (
                    <img className={'userImage'} src={images[1].url} alt={'Profile Image'} />
                ) : (
                    <img className={'userImage'} src={defaultImage} alt={'Default Profile Image'} />
                )}
                <div className={'usernameDisplay'}>
                    <p id={'profile'}>Profile</p>
                    <h1>{username}</h1>
                    <h3>{followers.total} Following</h3>
                </div>
            </div>
            
            {/* Top Artist Display */}
            <div className={'artistDisplay-container'}>
                <h3>Your Favorite Artists</h3>
                <div className={'cardDisplay'}>
                    {topArtists.map((artist, index) => (
                        <div key={index} className={'card'}>
                            <Link to={`https://open.spotify.com/artist/${artist.artistId}`} target={'_blank'} className={'card-link'}>
                                <img className={'card-image'} src={artist.images[0].url} alt={'album Image'}/>
                                <div className={'card-info'}>
                                    <h4>{artist.name}</h4>
                                    {artist.genres[0] && <p>{artist.genres[0]}</p>}
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            {/* Most Played Track Display */}
            <div className={'trackDisplay-container'}>
                <h3>Your Most Played Tracks</h3>
                <div className={'infoDisplay'}>
                    <p className={'trackNumber'}>#</p>
                    <div className={'trackInfoContainer'} id={'title'}>
                        <p>Title</p>
                    </div>
                    <div className='trackAlbumContainer'>
                        <p className={'trackAlbum'}>Album</p>
                        <p className={'trackPopularity'}>Popularity ?/100</p>
                    </div>
                </div>
                {topTracks.map((track, index) => (
                    <div key={index}>
                        <Link to={`https://open.spotify.com/track/${track.id}`} target={'_blank'} className='trackList'>
                            <p className={'trackNumber'}>{index+1}</p>
                            <div className={'trackInfoContainer'}>
                                <img className={'trackImage'} src={track.albumImages[0].url} alt={'album Image'}/>
                                <div className='trackNameContainer'>
                                    <p className={'trackName'}>{track.name}</p>
                                    <p className={'trackArtist'}>{track.artists[0].name}</p>
                                </div>
                            </div>
                            <div className='trackAlbumContainer'>
                                <p className={'trackAlbum'}>{track.albumName}</p>
                                <p className={'trackPopularity'}>{track.popularity}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {/* currently playing */}
            {currentlyPlaying.isPlaying ? (
                <div className={'backgroundDiv'} style={{'--background-image-url': `url(${currentlyPlaying.albumArt[0].url})`}}>
                    <div className={'playingDisplay-container'}>
                        <img className={'listeningToImage'} src={currentlyPlaying.albumArt[1].url} alt={'album Image'}/>
                        <div className={'currentlyPlaying-text'}>
                            <h3>Now Playing</h3>
                            <h1>{currentlyPlaying.songTitle}</h1>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={'notPlayingDisplay-container'}>
                    <h3>You're Not Listening To Anything Currently</h3>
                </div>
            )}

            {/* Recommended Tracks */}
            <div className={'recommended-container'}>
                <h3>Check These Out Next</h3>
                <div className={'cardDisplay'}>
                    {recommendedTracks.map((recommended, index) => (
                        <div key={index} className={'card'}>
                            <Link to={`https://open.spotify.com/track/${recommended.id}`} target={'_blank'} className={'card-link'}>
                                <img className={'card-image'} src={recommended.images[0].url} alt={'album Image'}/>
                                <div className={'card-info'}>
                                    <h4>{recommended.name}</h4>
                                    <p>{recommended.artists[0].name}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default UserDisplay;