import Header from "../Header"
import { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl, spotify, makeSpotifyPlaylist, addTrackSpotifyPlaylist, deleteTrackSpotify, searchTracksSpotify } from "../../spotify";
import AddSongs from "../AddSongs";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom"
import { getPlaylists, postPlaylist, updatePlaylist } from "../../api";

export async function loader() {
	const response = await fetch("http://localhost:3001/api/playlists");
	const playlistResults = await response.json()
	return { playlistResults };
}

export default function Root() {
	const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyToken'));
	const [playlist, setPlaylist] = useState();
	const [playlists, setPlaylists] = useState([])
	const [user, setUser] = useState();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([])
	const [isValidUser, setIsValidUser] = useState(false)
	const [playlistAccessInput, setPlaylistAccessInput] = useState()
	const [playlistAccessUser, setPlaylistAccessUser] = useState()
	const [newPlaylist, setNewPlaylist] = useState([])
	const [playlistSettings, setPlaylistSettings] = useState({ name: "", description: "", settings: false, access: [] })

	const playlistObject = {
		collaborative: false,
		description: "A playlist by Keira and Jack for all our favourite music this February.",
		external_urls: { spotify: "https://open.spotify.com/playlist/0u1soa420MFBPIQTTe8F5H" },
		followers: { href: null, total: 0 },
		href: "https://api.spotify.com/v1/playlists/0u1soa420MFBPIQTTe8F5H",
		id: "0u1soa420MFBPIQTTe8F5H",
		images: [{ height: 640, url: "https://mosaic.scdn.co/640/ab67616d0000b2731284506…77db22d1cab67616d0000b273fbc71c99f9c1296c56dd51b6", width: 640 }, { height: 300, url: "https://mosaic.scdn.co/300/ab67616d0000b2731284506…77db22d1cab67616d0000b273fbc71c99f9c1296c56dd51b6", width: 300 }, { height: 60, url: "https://mosaic.scdn.co/60/ab67616d0000b27312845065…77db22d1cab67616d0000b273fbc71c99f9c1296c56dd51b6", width: 60 }],
		name: "February Tunes",
		owner: { display_name: "keirastanley14", external_urls: { spotify: "https://open.spotify.com/user/keirastanley14" }, href: "https://api.spotify.com/v1/users/keirastanley14", id: "keirastanley14", type: "user"},
		primary_color: null,
		public: false,
		snapshot_id: "MTIsZWNhMjZiNWM3YjIyNWJmMzNiM2NkNjI1OGRjYjFjYTgzZmFhMTgxZQ==",
		tracks: { href: "https://api.spotify.com/v1/playlists/0u1soa420MFBP…H/tracks?offset=0&limit=100&locale=en-GB,en;q=0.9", items: Array, limit: 100, next: null, offset: 0},
		type: "playlist",
		uri: "spotify:playlist:0u1soa420MFBPIQTTe8F5H"
	}

	useEffect(() => {
		console.log(playlists)
	}, [])

	async function getAllPlaylists() {
		const playlistArr = await getPlaylists()
		const userData = await spotify.getMe()
		const allPlaylists = playlistArr.filter(item => item.access.includes(userData.id))
		setPlaylists(allPlaylists)
	}

	/**
	 * This function takes in user input and sets the "name" state
	 */
	function playlistName(event) {
		setPlaylistSettings({ ...playlistSettings, name: event.target.value });
	}

	useEffect(() => {
		if (spotifyToken) {
			spotify.setAccessToken(spotifyToken)
			spotify.getMe().then((user) => {
				setUser(user);
			});
		}
	}, [])

	/**
	 * This function takes in user input and sets the "description" state
	 */
	function playlistDescription(event) {
		setPlaylistSettings({ ...playlistSettings, description: event.target.value });
	}

	/**
	 * This function takes in user input and sets the public / private "setting" state
	 */
	function playlistSetting(event) {
		if (event.target.value === "Private") {
			setPlaylistSettings({ ...playlistSettings, settings: true });
		}
		else {
			setPlaylistSettings({ ...playlistSettings, settings: false });
		}
	}

	function getPlaylistAccessInput(event) {
		setPlaylistAccessInput(event.target.value)
	}

	function playlistAccess(event) {
		setPlaylistSettings({ ...playlistSettings, access: [...playlistSettings.access, event.target.id] })
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
				}
			}).catch((err) => {
				console.log(err.status)
				setIsValidUser(false)
			})
		}
	}

	function resetAccessUser() {
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
		console.log("hi", playlistVariable)
		const playlistObject = {
			playlist_id: playlistVariable.id,
			name: playlistVariable.name,
			description: playlistVariable.description,
			image: "/images/cyber-mix-default-image.png",
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
		console.log("hello")
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

	function removeAccessUser(event) {
		const newAccess = playlistSettings.access.filter((element, id) => element !== event.target.id)
		setPlaylistSettings({ ...playlistSettings, access: newAccess })
	}

	return <div className="root-container">
		<img src="/images/cyber-mix-default-image.png"></img>
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
				playlists: playlists,
				user: user,
				results: results,
				isValidUser: isValidUser,
				playlistSettings: playlistSettings,
				playlistAccessInput: playlistAccessInput,
				playlistAccessUser: playlistAccessUser,
				setPlaylist: setPlaylist,
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
				removeAccessUser: removeAccessUser,
				getAllPlaylists: getAllPlaylists
			}
		} />
	</div>
}