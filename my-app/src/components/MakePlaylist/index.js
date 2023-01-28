import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import { useOutletContext } from "react-router-dom";

export default function MakePlaylist() {
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const [accessUserAdded, setAccessUserAdded] = useState(false);

    const context = useOutletContext();

    useEffect(() => {
        console.log(context.isValidUser)
    }, [context.isValidUser])

    function Message() {
        return context.isValidUser ? null : <p>Invalid user. Please enter a valid Spotify username.</p>
    }

    const spotifyToken = context.spotifyToken

return spotifyToken ? <div>
        <h1>Make a playlist</h1>
        <p>Name</p>
        <input onBlur={context.playlistName}></input>
        <p>Description</p>
        <input onBlur={context.playlistDescription}></input>
        <p>Share with</p>
        {invalidCredentials ? <Message/> : null}
        {context.playlistAccessUser ? <div className="access-user-container">
            <div className="access-user-names">
                <a href={context.playlistAccessUser.external_urls.spotify}>{context.playlistAccessUser.display_name}</a>
                <p>{context.playlistAccessUser.id}</p>
                <button onClick={(event) => {context.playlistAccess(event); context.resetAccessUser()}} id={context.playlistAccessUser.id}>Add</button>
            </div>
        {context.playlistAccessUser.images.length > 0 ? <img src={context.playlistAccessUser.images[0].url}></img> : null}</div> : null}
        {context.playlistSettings.access.length > 0 ? context.playlistSettings.access.map(user => <div className="added-access-user">{user}<p onClick={context.removeAccessUser} id={user}>X</p></div>) : null}
        <input onBlur={context.getPlaylistAccessInput} placeholder="Enter a spotify username"></input>
        <button onClick={context.validateUser}>Search</button>
        <p>Select a setting</p>
        <select onChange={context.playlistSetting}>
        <option>Public</option>
        <option>Private</option>
        </select>
        {context.isValidUser ? <button onClick={() => {context.makePlaylist()}}><Link to="../add-songs">Make playlist</Link></button> : <button onClick={() => setInvalidCredentials(true)}><Link to="">Make playlist</Link></button>}
    </div> : <h1>You are no longer signed in</h1>;
}