import '../styles/Loading.css';
import musicNote from '../images/music-note.png';

const Loading = (props) => {
    return (
        <div className={'loading-container'}>
            <div className={'music-container'}>
                <img src={musicNote} alt={'music note'} className={'musicNote animate-opacity1'} id={'note1'}/>
                <img src={musicNote} alt={'music note'} className={'musicNote animate-opacity2'} id={'note2'}/>
                <img src={musicNote} alt={'music note'} className={'musicNote animate-opacity3'} id={'note3'}/>
            </div>
            <h1>Loading...</h1>
        </div>
    )
}
export default Loading;