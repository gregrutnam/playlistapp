import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOutletContext, useLoaderData } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { getPlaylists } from "../../api";
import AddSongs from "../AddSongs";

const spotify = new SpotifyWebApi();

export default function Playlists(){
  // const { playlistResults } = useLoaderData();
  const context = useOutletContext();

  const spotifyToken = context.spotifyToken

    const [playlists, setPlaylists] = useState([])
    const [user, setUser] = useState()

      useEffect(() => {
        async function getPlaylistData() {
          const playlistArr = await getPlaylists()
          const userData = await spotify.getMe()
          const playlistData = playlistArr.filter(item => item.access.includes(userData.id))
          setPlaylists(playlistData)
        }getPlaylistData()
      }, [])

      useEffect(() => {
        console.log("playlists", playlists)
      }, [playlists])


      useEffect(() => {
        console.log("user", user)
      }, [user])
      
  return spotifyToken ? <>
        <h1>My mixes</h1>
        <div className="playlists-container">
          {playlists ? playlists.map(el => 
            <div className="playlist">
                <div className="playlist-name-button"><h4>{el.name}</h4> <Link to={`${el.playlist_id}`}><button>Edit</button></Link></div>
                <p>Made by {el.created_by} on {el.date.split(" ").slice(0, 4).join(" ")}</p>
            </div>) : null}
        </div>
    </> : <h1>You are no longer signed in</h1>
}