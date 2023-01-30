import { useLoaderData, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchSongs from "../SearchSongs";
import Edit from "../Edit";
import { getSpotifyPlaylist } from "../../functions/spotify";

export async function loader({ params }) {
    const response = await getSpotifyPlaylist(params.playlistId)
    return response;
}

export default function Playlist() {
    const playlistData = useLoaderData();
    const context = useOutletContext()

    useEffect(() => {
        context.setPlaylist(playlistData)
    }, [])

    async function updatePlaylistDetails() {
        const response = await getSpotifyPlaylist(playlistData.playlist_id)
        context.setPlaylist(response) 
    }

    useEffect(() =>{
        updatePlaylistDetails()
    }, [])

    return context.playlist ? <div className="add-songs-container">
            <SearchSongs playlist={context.playlist}/>
            <Edit/>
    </div> : <p>Playlist not found</p>
}
