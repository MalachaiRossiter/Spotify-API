import axios from 'axios';

const SearchButton = (props) => {

    const submitHandler = (e) =>{
        e.preventDefault();
        axios.get(`http://localhost:8000/api/spotify/artist`)
        .then((res) => {
            console.log(res.data);
        })
        .catch((err) => {console.log(err)});
    }


    return(
        <div className={'serach-container'}>
            <button onClick={submitHandler}>Search</button>
        </div>
    )
}
export default SearchButton;