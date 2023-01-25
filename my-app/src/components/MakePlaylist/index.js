import { Link } from "react-router-dom";
import {useEffect, useState} from "react";
import { useOutletContext } from "react-router-dom";

export default function MakePlaylist() {
    const [invalidCredentials, setInvalidCredentials] = useState(false)
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
        <input onBlur={context.playlistAccess} placeholder="Enter a spotify username"></input>
        <p>Select a setting</p>
        <select onChange={context.playlistSetting}>
        <option>Public</option>
        <option>Private</option>
        </select>
        {context.isValidUser ? <button onClick={() => {context.makePlaylist()}}><Link to="../add-songs">Make playlist</Link></button> : <button onClick={() => setInvalidCredentials(true)}><Link to="">Make playlist</Link></button>}
    </div> : <h1>You are no longer signed in</h1>;
}
