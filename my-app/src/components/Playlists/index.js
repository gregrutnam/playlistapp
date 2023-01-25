import { useEffect, useState, useOutletContext } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

export default function Playlists(){

  const context = useOutletContext();

  const spotifyToken = context[0].spotifyToken

    const [seeMoreToggle, setSeeMoreToggle] = useState(false)
    const [playlistData, setPlaylistData] = useState([])
    const [ids, setIds] = useState([])
    const [playlists, setPlaylists] = useState([])
    const [user, setUser] = useState()

      useEffect(() => {
        getPlaylistData()
        getUser()
      }, [])
    
      async function getPlaylistData() {
        const response = await fetch('http://localhost:3001/api/playlists')
        const data = await response.json();
        setPlaylistData(data.payload)
      }
      async function getUser(){
        const user_ = await spotify.getMe()
        setUser(user_)
      }

      useEffect(() => {
        const idArr = []
        playlistData.map(data => {
          if (data.access.includes(user.id)) {
            idArr = [...idArr, playlistData.playlist_id]
          }
        })
      }, [playlistData])

      useEffect(() => {
        async function getPlaylists() {
          let playlistArr = []
          for (let i = 0 ; i < ids.length; i++) {
            let playlist = await spotify.getPlaylist(ids[i])
            playlistArr = [...playlistArr, playlist]
          }
        } getPlaylists()
      }, [ids])

      
    function setToggle(){
        setSeeMoreToggle(!seeMoreToggle)
    }

    // function ShowPlaylistInfo({id}){
    //     console.log(id)
    //     const match = mixes.filter(el => el.id === id)[0]
    //     console.log(match)
    //     return <div>
    //         <i>{match.description}</i>
    //         <ul>
    //             {match.tracks.items.map(el => <li>{el.track.name} - {el.track.artists[0].name}</li>)}
    //         </ul>
    //     </div>
    // }

  //   return !spotifyToken ? 
  //   //If someone hasn't signed in (If there isn't a spotify token):
  //   <a href={loginUrl} id="login-button">Sign in with Spotify! </a>
  //  : <>
  return <>
        <h1>My mixes</h1>
        <button onClick={setToggle}>See more</button>
        {playlists.map(el => seeMoreToggle ? <div>
            <p>{el.name}</p>
            {/* <ShowPlaylistInfo id={el.id}/> */}
         </div> : <div><p>{el.name}</p></div>)}
    </>
}