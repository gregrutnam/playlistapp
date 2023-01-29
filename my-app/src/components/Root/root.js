import Header from "../Header"
import { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl, spotify, makeSpotifyPlaylist, addTrackSpotifyPlaylist, deleteTrackSpotify, searchTracksSpotify } from "../../spotify";
import AddSongs from "../AddSongs";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom"
import { getPlaylistById, postPlaylist, updatePlaylist} from "../../api";

export async function loader() {
	const response = await fetch("http://localhost:3001/api/playlists");
	const playlistResults = await response.json()
	return { playlistResults };
  }

export default function Root() {
const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyToken'));
const [playlist, setPlaylist] = useState();
const [user, setUser] = useState();
const [query, setQuery] = useState("");
const [results, setResults] = useState([])
const [isValidUser, setIsValidUser] = useState(false)
const [playlistAccessInput, setPlaylistAccessInput] = useState()
const [playlistAccessUser, setPlaylistAccessUser] = useState()
const [newPlaylist, setNewPlaylist] = useState([])
const [playlistSettings, setPlaylistSettings] = useState({ name: "", description: "", settings: false, access: [] })
	/**
	 * This function takes in user input and sets the "name" state
	 */
	function playlistName(event) {
		setPlaylistSettings({...playlistSettings, name: event.target.value});
	}

	useEffect(() => {
		if (spotifyToken) {
			spotify.setAccessToken(spotifyToken)
			spotify.getMe().then((user) => {
				setUser(user);
		});
		}
		console.log("user: ", user)
	}, [])

	/**
	 * This function takes in user input and sets the "description" state
	 */
	function playlistDescription(event) {
		setPlaylistSettings({...playlistSettings, description: event.target.value});
	}

	/**
	 * This function takes in user input and sets the public / private "setting" state
	 */
	function playlistSetting(event) {
		if (event.target.value === "Private") {
			setPlaylistSettings({...playlistSettings, settings: true});
		}
		else {
			setPlaylistSettings({ ...playlistSettings, settings: false });
		}
	}

	function getPlaylistAccessInput(event) {
		setPlaylistAccessInput(event.target.value)
	}

	function playlistAccess(event) {
		setPlaylistSettings({...playlistSettings, access: [...playlistSettings.access, event.target.id]})
	}

	useEffect(() => {
		console.log(playlistSettings)
	}, [playlistSettings])

	function validateUser() {
		if (playlistAccessInput.length > 0) {
			spotify.getUser(`${playlistAccessInput}`).then((response) => {
				console.log(response)
				if (response.display_name) {
					console.log(true)
					console.log(response)
					setIsValidUser(true)
					setPlaylistAccessUser(response)
				}}).catch((err) => {
					console.log(err.status)
					setIsValidUser(false)
				})
		}
	}

	function resetAccessUser(){
		setPlaylistAccessUser()
	}

	/**
	 * This function authenticates the user and sets "token" to the authentication token that we receive
	 */
	useEffect(() => {
		const _spotifyToken = getTokenFromUrl().access_token;
		window.location.hash = "";
		if (_spotifyToken) {
			setSpotifyToken(_spotifyToken);
			localStorage.setItem('spotifyToken', _spotifyToken)
			spotify.setAccessToken(_spotifyToken);
		}
	}, []);

	/**
	 * Creates a playlist on Spotify, then stores the data about this playlist as state, builds a new playlist object with the structure and information needed for the backend and adds this new playlist to the database
	 */
	async function makePlaylist() {
		const playlistVariable = await makeSpotifyPlaylist(user.id, playlistSettings)
		setPlaylist(playlistVariable)
		console.log(playlistVariable)
		const playlistObject = {
				playlist_id: playlistVariable.id,
				name: playlistVariable.name,
				link: playlistVariable.external_urls.spotify,
				created_by: playlistVariable.owner.display_name,
				tracks: playlistVariable.tracks.items,
				date: new Date().toString(),
				access: [playlistVariable.owner.display_name, ...playlistSettings.access]
		}
		const newPlaylist = await postPlaylist(playlistObject);
		setNewPlaylist(newPlaylist)
	}

	/**
	 * This function adds tracks to a playlist on Spotify and then updates the playlist accordingly in the database
	 */
	async function addTracks(uri, playlistId) {
		const result = await addTrackSpotifyPlaylist(uri, playlistId)
		setPlaylist(result)
		await updatePlaylist(result);
	}

	function handleQuery(event) {
		setQuery(event.target.value)
	}

	async function searchTracks() {
		const result = await searchTracksSpotify(query);
		setResults(result.tracks.items)
	}

	async function deleteTrack(event) {
		const updatedPlaylist = await deleteTrackSpotify(event.target.name, event.target.
			id, event.target.className)
		setPlaylist(updatedPlaylist)
	}

	function removeAccessUser(event){
		const newAccess = playlistSettings.access.filter((element, id) => element !== event.target.id)
		setPlaylistSettings({...playlistSettings, access: newAccess})
	}

	return <div className="root-container">
			<h1>Cyber-Mix</h1>
			{user ? <>
					<Header />
					<p>Logged in as {user.display_name}</p>
			</> :
					<a href={loginUrl} id="login-button"> Sign in with Spotify! </a>
			}
			<Outlet context={
				{
					spotifyToken: spotifyToken, 
					playlist: playlist,
					user: user, 
					results: results, 
					isValidUser: isValidUser, 
					playlistSettings: playlistSettings, 
					playlistAccessInput: playlistAccessInput, 
					playlistAccessUser: playlistAccessUser, 
					playlistName: playlistName, 
					playlistDescription: playlistDescription, 
					playlistSetting: playlistSetting, 
					makePlaylist: makePlaylist, 
					addTracks: addTracks, 
					searchTracks: searchTracks, 
					deleteTrack: deleteTrack, 
					handleQuery: handleQuery, 
					playlistAccess: playlistAccess, 
					validateUser: validateUser, 
					getPlaylistAccessInput: getPlaylistAccessInput, 
					resetAccessUser: resetAccessUser, 
					removeAccessUser: removeAccessUser}
				} />
	</div>
}