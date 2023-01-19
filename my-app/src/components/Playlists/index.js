import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

export default function Playlists(){
    const [seeMoreToggle, setSeeMoreToggle] = useState(false)
    const [playlists, setPlaylists] = useState([])
    const [mixes, setMixes] = useState([])
    const [user, setUser] = useState()

    useEffect(() => {
        getPlaylists()
      }, [])

      useEffect(() =>{
        console.log("Playlists: ", playlists)
      }, [playlists])

      useEffect(() =>{
        console.log("Mixes: ", mixes)
      }, [mixes])

      useEffect(() =>{
        console.log("User: ", user)
      }, [user])

      useEffect(() => {
        async function getUser(){
          const user_ = await spotify.getMe()
          setUser(user_)
        } getUser()
      }, [])
    
      async function getPlaylists() {
        const response = await fetch('http://localhost:3001/api/playlist')
        const data = await response.json();
        setPlaylists(data.payload)
      }
      
      useEffect(() => {
        async function getMixes(){
          const mixArr = []
          for (let i = 0; i < playlists.length; i++){
            if (playlists[i].user === user.id){
              const item = await spotify.getPlaylist(playlists[i].id);
              mixArr.push(item);
            }
          }
          setMixes(mixArr)
        } getMixes();
      }, [])


    function setToggle(){
        setSeeMoreToggle(!seeMoreToggle)
    }

    function ShowPlaylistInfo({id}){
        console.log(id)
        const match = mixes.filter(el => el.id === id)[0]
        console.log(match)
        return <div>
            <i>{match.description}</i>
            <ul>
                {match.tracks.items.map(el => <li>{el.track.name} - {el.track.artists[0].name}</li>)}
            </ul>
        </div>
    }

  //   return !spotifyToken ? 
  //   //If someone hasn't signed in (If there isn't a spotify token):
  //   <a href={loginUrl} id="login-button">Sign in with Spotify! </a>
  //  : <>
  return <>
        <h1>My mixes</h1>
        <button onClick={setToggle}>See more</button>
        {mixes.map(el => seeMoreToggle ? <div>
            <p>{el.name}</p>
            <ShowPlaylistInfo id={el.id}/>
         </div> : <div><p>{el.name}</p></div>)}
    </>
}