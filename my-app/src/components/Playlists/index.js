import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOutletContext, useLoaderData } from "react-router-dom";

export default function Playlists(){
  // const { playlistResults } = useLoaderData();
  const context = useOutletContext();

  const spotifyToken = context.spotifyToken
    const [user, setUser] = useState()

      useEffect(() => {
        context.getAllPlaylists()
      }, [])

      useEffect(() => {
        console.log("playlists", context.playlists)
      }, [context.playlists])


      useEffect(() => {
        console.log("user", user)
      }, [user])
      
  return spotifyToken ? <>
        <h1>My mixes</h1>
        <div className="playlists-container">
          {context.playlists ? context.playlists.map(el => 
            <div className="playlist">
                <div className="playlist-name-button">
                  <h4>{el.name}</h4> 
                  <Link to={`${el.playlist_id}`}><button>Edit</button></Link>
                </div>
                <img src={el.image}></img>
                <p>Made by {el.created_by}</p>
                <p>{el.date.split(" ").slice(0, 4).join(" ")}</p>
            </div>) : null}
        </div>
    </> : <h1>You are no longer signed in</h1>
}