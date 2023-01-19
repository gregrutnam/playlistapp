import "./App.css";
import { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl } from "../../spotify";
import SpotifyWebApi from "spotify-web-api-js";
import MakePlaylist from "../MakePlaylist";
import AddSongs from "../AddSongs";
import Playlists from "../Playlists";
import Header from "../Header";
import { Link } from "react-router-dom";

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
  const [playlistIds, setPlaylistIds] = useState([])
  const [mixes, setMixes] = useState([])

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
    if (event.target.value === "Private") {
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
    const _spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = "";
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
    setPlaylist(playlistVariable)
    await postPlaylist(playlistVariable.id);
  }

  async function postPlaylist(id) {
    const response = await fetch('http://localhost:3001/api/playlist',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id,
        })
      })
    const data = await response.json();
    console.log(data.payload)
  }

  /**
   * This function makes a POST request to Spotify that adds songs to a playlist given its id
   */
  async function addTracks(event) {
    const options = { position: 0 };
    const uri = [event.target.id];
    await spotify.addTracksToPlaylist(
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

  async function searchTracks() {
    const options = { limit: 50 }
    let result = await spotify.searchTracks(query, options)
    setResults(result.tracks.items)
  }

  async function deleteTrack(event) {
    if (window.confirm("Are you sure you want to remove this track?")) {
      let result = await spotify.removeTracksFromPlaylist(event.target.id, [event.target.className])
      let updatedPlaylist = await spotify.getPlaylist(playlist.id)
      setPlaylist(updatedPlaylist)
    }
  }

  useEffect(() => {
    getPlaylists()
  }, [])

  async function getPlaylists() {
    const response = await fetch('http://localhost:3001/api/playlist')
    const data = await response.json();
    const ids = await data.payload.map(el => el.id)
    setPlaylistIds(ids)
    console.log(ids)
  }

  useEffect(() => {
    async function getMixes(){
      const mixArr = []
      for (let i = 0; i < playlistIds.length; i++) {
        const item = await spotify.getPlaylist(playlistIds[i]);
        mixArr.push(item)
      }
      setMixes(mixArr)
    } getMixes()
  }, [playlistIds])

  return (
    <div className="App">
      {!spotifyToken ? (
        //If someone hasn't signed in (If there isn't a spotify token):
        <a href={loginUrl} id="login-button"> Sign in with Spotify! </a>
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
        <AddSongs
          searchTracks={searchTracks}
          addTracks={addTracks}
          deleteTrack={deleteTrack}
          handleQuery={handleQuery}
          results={results}
          playlist={playlist}
        />
      )}
      <Playlists mixes={mixes}/>
    </div>
  );
}

export default App;
