import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOutletContext, useLoaderData } from "react-router-dom";
import { ClipLoader } from 'react-spinners';

export default function Playlists(){
  const context = useOutletContext();
  console.log(context)
  
  const spotifyToken = context.spotifyToken
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

      useEffect(() => {
        context.getAllPlaylists()
      }, [])

      useEffect(() => {
        if (context.playlists) {
          setLoading(false)
        }
      }, [context.playlists])

      useEffect(() => {
        console.log(loading)
      }, [loading])


      useEffect(() => {
        console.log("user", user)
      }, [user])
      
  return spotifyToken ? <>
        <h1>My mixes</h1>
        <div className="playlists-container">
          <ClipLoader
            color="black"
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
		      />
          {context.playlists ? context.playlists.map(el => 
            <div className="playlist" key={uuidv4()}>
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