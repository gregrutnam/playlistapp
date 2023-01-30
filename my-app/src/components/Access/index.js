import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function Access() {
    const context = useOutletContext()

    useEffect(() => { console.log("is valid user?", context.playlistAccessUser) }, [context.playlistAccessUser])

    function Message() {
        return context.isValidUser ? null : <p>Invalid user. Please enter a valid Spotify username.</p>
    }

    function DisplayUser() {
        return <div className="access-user-container">
            <div className="access-user-names">
                <a href={context.playlistAccessUser.external_urls.spotify}>
                    {context.playlistAccessUser.display_name}
                </a>
                <p>
                    {context.playlistAccessUser.id}
                </p>
                <button 
                    onClick={(event) => { 
                        context.playlistAccess(event); 
                        context.setPlaylistAccessUser()
                    }} 
                    id={context.playlistAccessUser.id}>
                        Add
                </button>
            </div>
            {context.playlistAccessUser.images.length > 0 ? 
                <img src={context.playlistAccessUser.images[0].url}></img> : null}
        </div>
    }

    function DisplayAddedUsers() {
        return context.playlistSettings.access.map(user => <div className="added-access-user" key={uuidv4}>{user}<p onClick={context.removeAccessUser} id={user}>X</p></div>)
    }

    return <div>{context.isValidUser ? null : <Message />}
        {context.playlistAccessUser ? <DisplayUser /> : null}
        {context.playlistSettings.access.length > 0 ? <DisplayAddedUsers /> : null}
        <input onBlur={() => context.getPlaylistAccessInput()} placeholder="Enter a spotify username"></input>
        <button onClick={() => { context.setPlaylistAccessUser(); context.validateUser();}}>Search</button>
    </div>
}