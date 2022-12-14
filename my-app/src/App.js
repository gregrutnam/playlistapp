import './App.css';
import {useEffect, useState} from 'react';
import { loginUrl, getTokenFromUrl } from '../src/spotify';
import SpotifyWebApi from 'spotify-web-api-js';

const spotify = new SpotifyWebApi();
 


function App() {
  const [spotifyToken, setSpotifyToken] = useState("")
  const [playlistId, setPlaylistId] = useState("")
  const [user, setUser] = useState()
  const options = {"position":0}
  const uris = ["spotify:track:0Pie5DFAHHxpkONFUsAI6s", "spotify:track:0aMqNFBj9KtPTD3c3tByRT"]

async function makePlaylist() {
  spotify.setAccessToken(spotifyToken)
  let userId = user.id
  let data = {name: "Playlist 4", description: "Another test playlist", public: true}
  let playlistVariable = await spotify.createPlaylist(userId, data)
  setPlaylistId(playlistVariable.id)
  console.log(playlistVariable)

 }  

const tracksAddedToPlaylist = spotify.addTracksToPlaylist (
  playlistId,
  uris,
  options
)

console.log(tracksAddedToPlaylist)
  useEffect(()=>{
    console.log("This is what we derived from the URL: ", getTokenFromUrl())
    
    const _spotifyToken = getTokenFromUrl().access_token;

    window.location.hash = ""

    console.log("THIS IS OUR SPOTIFY TOKEN DEUCES ", _spotifyToken)

    if (_spotifyToken){
      setSpotifyToken(_spotifyToken)

      spotify.setAccessToken(_spotifyToken)

      spotify.getMe().then((user)=>{
        setUser(user);
      });
    }
    makePlaylist()
  })



  return (
    <div className="App">
    <a href={loginUrl} id="signInButton">Sign in with Spotify!</a>
    </div>
  );
}

export default App;
