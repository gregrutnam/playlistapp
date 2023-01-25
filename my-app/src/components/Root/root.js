import Header from "../Header"
import { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl } from "../../spotify";
import AddSongs from "../AddSongs";
import { Link } from "react-router-dom";
import SpotifyWebApi from "spotify-web-api-js";
import { Outlet } from "react-router-dom"

const spotify = new SpotifyWebApi();

export default function Root() {
const [spotifyToken, setSpotifyToken] = useState("");
const [playlist, setPlaylist] = useState();
const [user, setUser] = useState();
const [query, setQuery] = useState("");
const [results, setResults] = useState([])
const [isValidUser, setIsValidUser] = useState(false)
const [playlistSettings, setPlaylistSettings] = useState({ name: "", description: "", settings: false })
	/**
	 * This function takes in user input and sets the "name" state
	 */
	function playlistName(event) {
		const newPlaylistSettings = { ...playlistSettings };
		newPlaylistSettings.name = event.target.value;
		setPlaylistSettings(newPlaylistSettings);
	}

	/**
	 * This function takes in user input and sets the "description" state
	 */
	function playlistDescription(event) {
		const newPlaylistSettings = { ...playlistSettings };
		newPlaylistSettings.description = event.target.value;
		setPlaylistSettings(newPlaylistSettings);
	}

	/**
	 * This function takes in user input and sets the public / private "setting" state
	 */
	function playlistSetting(event) {
		if (event.target.value === "Private") {
			const newPlaylistSettings = { ...playlistSettings };
			newPlaylistSettings.settings = true;
			setPlaylistSettings(newPlaylistSettings);
		}
		else {
			const newPlaylistSettings = { ...playlistSettings };
			newPlaylistSettings.settings = false;
			setPlaylistSettings(newPlaylistSettings);
		}
	}

	function playlistAccess(event) {
		if (event.target.value.length > 0) {
			const check = spotify.getUser(`${event.target.value}`).then((response) => {
				if (response.display_name) {
					setIsValidUser(true)
					const newPlaylistSettings = {...playlistSettings}
					newPlaylistSettings.access = event.target.value
					setPlaylistSettings(newPlaylistSettings)
				}
				else {
					setIsValidUser(false)
				}
			})
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
			name: playlistSettings.name,
			description: playlistSettings.description,
			//DOESN'T WORK RIGHT NOW
			public: playlistSettings.settings,
		};
		if (playlistSettings.name.length > 0) {
			let playlistVariable = await spotify.createPlaylist(userId, data);
			setPlaylist(playlistVariable)
			let date = new Date().toString()
			await postPlaylist(playlistVariable.id, playlistVariable.owner.id, date, playlistSettings.access);
		}
	}

	async function postPlaylist(playlist_id, created_by, date, access) {
		const playlistObject = {
			playlist_id: playlist_id,
			created_by: created_by,
			date: date,
			access: [created_by, access]
		}
		const response = await fetch('http://localhost:3001/api/playlists',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(playlistObject)
		})
		const data = await response.json();
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
		if (window.confirm(`Are you sure you want to remove ${event.target.name}?`)) {
			let result = await spotify.removeTracksFromPlaylist(event.target.id, [event.target.className])
			let updatedPlaylist = await spotify.getPlaylist(playlist.id)
			setPlaylist(updatedPlaylist)
		}
	}

	return <div className="root-container">
			<h1>Cyber-Mix</h1>
			{user ? <>
					<Header />
					<p>Logged in as {user.display_name}</p>
			</> :
					<a href={loginUrl} id="login-button"> Sign in with Spotify! </a>
			}
			<Outlet context={{spotifyToken: spotifyToken, playlist: playlist, user: user, results: results, playlistSettings: playlistSettings, playlistName: playlistName, playlistDescription: playlistDescription, playlistSetting: playlistSetting, makePlaylist: makePlaylist, postPlaylist: postPlaylist, addTracks: addTracks, searchTracks: searchTracks, deleteTrack: deleteTrack, handleQuery: handleQuery, playlistAccess: playlistAccess, isValidUser: isValidUser}} />
	</div>
}