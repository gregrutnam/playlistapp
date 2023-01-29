import { useLoaderData, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import Track from "../Track";
import { updatePlaylist } from "../../api";
import AddSongs from "../AddSongs";
import SearchSongs from "../SearchSongs";
import EditSongs from "../EditSongs";
import { getSpotifyPlaylist, spotify } from "../../spotify";

export async function loader({ params }) {
    console.log("HI", params)
    const response = await getSpotifyPlaylist(params.playlistId)
    return response;
}

export default function Playlist() {
    const playlistData = useLoaderData();
    const [playlist, setPlaylist] = useState(playlistData)
    const [added, setAdded] = useState(false)

    async function updatePlaylistDetails() {
        const response = await getSpotifyPlaylist(playlist.id)
        setPlaylist(response) 
    }

    useEffect(() =>{
        updatePlaylistDetails()
    })

    return <div className="add-songs-container">
            <SearchSongs playlist={playlist}/>
            <EditSongs playlist={playlist}/>
    </div>
}
