import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Access from "../Access";

export default function MakePlaylist() {

    const context = useOutletContext();

    useEffect(() => {
        console.log(context.isValidUser)
    }, [context.isValidUser])

    function MakePlaylistButton() {
        return context.isValidUser ? <button onClick={context.makePlaylist}><Link to="../add-songs">Make playlist</Link></button> : <button><Link to={``}>Make playlist</Link></button>
    }

    const spotifyToken = context.spotifyToken

    return spotifyToken ? <div>
        <h1>Make a playlist</h1>
        <p>Name</p>
        <input onBlur={context.playlistName}></input>
        <p>Description</p>
        <input onBlur={context.playlistDescription}></input>
        <p>Share with</p>
        <Access/>
        <p>Select a setting</p>
        <select onChange={context.playlistSetting}>
            <option>Public</option>
            <option>Private</option>
        </select>
        <MakePlaylistButton/>
    </div> : <h1>You are no longer signed in</h1>;
}