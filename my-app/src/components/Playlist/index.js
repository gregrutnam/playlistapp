import { useLoaderData, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import Track from "../Track";
import { updatePlaylist } from "../../api";

export async function loader({ params }) {
    console.log("HI", params)
    const response = await fetch(`http://localhost:3001/api/playlists/${params.playlistId}`)
    const data = await response.json()
    const playlist = data.payload[0]
    return playlist;
}

export default function Playlist() {
    const [playlist, setPlaylist] = useState([])
    const context = useOutletContext()
    console.log("hey", context)

    const playlistData = useLoaderData();
    console.log("HEY", playlistData.tracks)
    let tracksArr = []
    for (let i = 0; i < playlistData.tracks.length; i++) {
        const trackSplit = JSON.stringify(playlistData.tracks).split("\\").filter((el, ind) => ind % 2 !== 0)
        let tracksObj = {}
        for (let i = 0; i < trackSplit.length; i++) {
            tracksObj[trackSplit[i].replace('"', "")] = trackSplit[i + 1].replace('"', "")
            i++;
        }
        tracksArr.push(tracksObj)
    }
    const newPlaylist = {...playlistData, tracks: tracksArr}

    async function deleteFromPlaylist(spotify_id, id) {
        const newPlaylist = await context.deleteTrack(spotify_id)
        console.log(newPlaylist)
    }

    return <>
        <h1>{newPlaylist.name}</h1>
        <p>{newPlaylist.description}</p>
        <div>{newPlaylist.tracks.map(item => <Track image={item.image} name={item.name} artist={item.artist} album={item.album} buttonFunction={() => deleteFromPlaylist()} buttonText="Remove"/>)}</div>
        
    </>
}
