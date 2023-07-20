import '../styles/Loading.css';
import musicNote from '../images/music-note.png';

const Loading = (props) => {
    return (
        <div className={'loading-container'}>
            <div className={'music-container'}>
                <img src={musicNote} alt={'music note'}/>
            </div>
        </div>
    )
}
export default Loading;