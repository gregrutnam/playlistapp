import "./App.css";
import { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl } from "../src/spotify";
import SpotifyWebApi from "spotify-web-api-js";
import MakePlaylist from "./MakePlaylist";
import AddSongs from "./AddSongs";

const spotify = new SpotifyWebApi();

function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [playlist, setPlaylist] = useState();
  const [user, setUser] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [setting, setSetting] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([])

  useEffect(() => {
    console.log("playlist name", name);
  }, [name]);

  useEffect(() => {
    console.log("playlist description", description);
  }, [description]);

  useEffect(() => {
    console.log("playlist setting", setting);
  }, [setting]);

  useEffect(() => {
    console.log("search query", query);
  }, [query])

  useEffect(() => {
    console.log("results", results);
  }, [results])
  /**
   * This function takes in user input and sets the "name" state
   */
  function playlistName(event) {
    setName(event.target.value);
  }

  /**
   * This function takes in user input and sets the "description" state
   */
  function playlistDescription(event) {
    setDescription(event.target.value);
  }

  /**
   * This function takes in user input and sets the public / private "setting" state
   */
  function playlistSetting(event) {
    if (event.target.value === "Private"){
      setSetting(false)
    }
    else {
      setSetting(true)
    }
  }

  /**
   * This function authenticates the user and sets "token" to the authentication token that we receive
   */
  useEffect(() => {
    console.log("This is what we derived from the URL: ", getTokenFromUrl());
    const _spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";
    console.log("THIS IS OUR SPOTIFY TOKEN DEUCES ", _spotifyToken);
    if (_spotifyToken) {
      setSpotifyToken(_spotifyToken);
      spotify.setAccessToken(_spotifyToken);
      spotify.getMe().then((user) => {
        setUser(user);
      });
    }
  }, []);

  /**
   * This function makes a POST request to Spotify that creates a playlist
   */
  async function makePlaylist() {
    spotify.setAccessToken(spotifyToken);
    let userId = user.id;
    let data = {
      name: name,
      description: description,
      //DOESN'T WORK RIGHT NOW
      public: false,
    };
    let playlistVariable = await spotify.createPlaylist(userId, data);
    setPlaylist(playlistVariable);
  }

  /**
   * This function makes a POST request to Spotify that adds songs to a playlist given its id
   */
  async function addTracks(event) {
    console.log("HELLOOOOO", event)
    const options = { position: 0 };
    const uri = [
      event.target.id
    ];
    const tracksAddedToPlaylist = await spotify.addTracksToPlaylist(
      playlist.id,
      uri,
      options
    );
    const result = await spotify.getPlaylist(playlist.id)
    setPlaylist(result)
  }

  function handleQuery(event) {
    setQuery(event.target.value)
  }
   
  async function searchTracks(){
    let result = await spotify.searchTracks(query)
    console.log(result)
    setResults(result.tracks.items)
  }

 

 return (
    <div className="App">
      {!spotifyToken ? (
        //If someone hasn't signed in (If there isn't a spotify token):
        <a href={loginUrl} id="signInButton">
          Sign in with Spotify!
        </a>
      ) : !playlist ? (
        //Else, we don't need a log-in button
        <MakePlaylist
          playlistName={playlistName}
          playlistDescription={playlistDescription}
          playlistSetting={playlistSetting}
          makePlaylist={makePlaylist}
        />
      ) : (
        //If they've made a playlist
        <AddSongs searchTracks={searchTracks} addTracks={addTracks} handleQuery={handleQuery} results={results} playlist={playlist}/>
      )}
    </div>
  );
}

export default App;
