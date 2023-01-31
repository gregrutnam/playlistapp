import { v4 as uuidv4 } from 'uuid';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOutletContext, useLoaderData } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { getPlaylists } from '../../functions/api';
import { getCurrentUser } from '../../functions/spotify';

export async function loader() {
	const response = await fetch("https://cybermix-backend.onrender.com/api/playlists");
	const playlistResults = await response.json()
	return playlistResults.payload;
}

export default function Playlists(){
  const playlistResults = useLoaderData()
  const [playlists, setPlaylists] = useState(playlistResults)
  const context = useOutletContext();
  console.log(context)
  
  const spotifyToken = context.spotifyToken
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(true)

      	/** Function to retrieve all playlists from the database that belong to the user or that they have been given access to by another user */
        async function getAllPlaylists() {
          const playlistArr = await getPlaylists()
          const userData = await getCurrentUser()
          const allPlaylists = playlistArr.filter(item => item.access.includes(userData.id))
          setPlaylists(allPlaylists)
        }

      useEffect(() => {
        getAllPlaylists()
      }, [])

      useEffect(() => {
        if (playlists) {
          setLoading(false)
        }
      }, [context.playlists])

      useEffect(() => {
        console.log(playlists)
      }, [playlists])


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
          {playlists ? playlists.map(el => 
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