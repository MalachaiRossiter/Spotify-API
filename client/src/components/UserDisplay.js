const UserDisplay = (props) => {

    const { userInformation } = props;

    return (
        <div className={'userDisplay-container'}>
            <p>{userInformation.username}</p>
        </div>
    )
}
export default UserDisplay;