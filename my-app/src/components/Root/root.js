import Header from "../Header"
import { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl, spotify, makeSpotifyPlaylist, addTrackSpotifyPlaylist, deleteTrackSpotify, searchTracksSpotify, updateSpotifyPlaylistDetails } from "../../functions/spotify";
import { Outlet, useLoaderData } from "react-router-dom"
import { getPlaylists, postPlaylist, updatePlaylist } from "../../functions/api";
import {ClipLoader} from "react-spinners";

export async function loader() {
	const response = await fetch("https://cybermix-backend.onrender.com/api/playlists");
	const playlistResults = await response.json()
	return playlistResults.payload;
}

export default function Root() {
	const playlistResults = useLoaderData()
	
	const [loading, setLoading] = useState(true)
	const [spotifyToken, setSpotifyToken] = useState(localStorage.getItem('spotifyToken'));
	const [playlist, setPlaylist] = useState();
	const [playlists, setPlaylists] = useState(playlistResults)
	const [user, setUser] = useState();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState([])
	const [isValidUser, setIsValidUser] = useState(true)
	const [playlistAccessInput, setPlaylistAccessInput] = useState()
	const [playlistAccessUser, setPlaylistAccessUser] = useState()
	const [newPlaylist, setNewPlaylist] = useState([])
	const [playlistSettings, setPlaylistSettings] = useState({ name: "", description: "", settings: false, access: [] })

	useEffect(() => {
		if (playlistResults) {
			setLoading(false)
		}
	}, [playlistResults])

	useEffect(() => {
		/**
		* This function authenticates the user and sets "token" to the authentication token that we receive
		*/
		function authenticateUser(){
			const _spotifyToken = getTokenFromUrl().access_token;
			window.location.hash = "";
			if (_spotifyToken) {
				setSpotifyToken(_spotifyToken);
				localStorage.setItem('spotifyToken', _spotifyToken)
				spotify.setAccessToken(_spotifyToken);				
				spotify.getMe().then((user) => {
					setUser(user);
				});
			}
		}
		authenticateUser()
	}, []);

	useEffect(() => {
		if (spotifyToken) {
			spotify.setAccessToken(spotifyToken)
			spotify.getMe().then((user) => {
				setUser(user);
			});
		}
	}, [])

	/** Function to retrieve all playlists from the database that belong to the user or that they have been given access to by another user */
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

	//ALL FUNCTIONS RELATED TO ACCESS
		

	
	/** Take in "Access" input and store it as state */		
	function getPlaylistAccessInput(event) {
		if (event.target.value.length > 0) {
			setPlaylistAccessInput(event.target.value)
		}
	}

	/**Check if the user's "Access" input matches a valid Spotify user. If yes, set "isValidUser" to true and set the access user details. If no, set "isValidUser" to false */
	function validateUser() {
		if (playlistAccessInput.length > 0) {
			spotify.getUser(`${playlistAccessInput}`).then((response) => {
				if (response.display_name) {
					setIsValidUser(true)
					setPlaylistAccessUser(response)
				}
			}).catch((err) => {
				console.log(err.status)
				setIsValidUser(false)
			})
		}
	}

	/** Add the user's id to the access array */
	function playlistAccess(event) {
		setPlaylistSettings({ ...playlistSettings, access: [...playlistSettings.access, event.target.id] })
	}

	function removeAccessUser(event) {
		const newAccess = playlistSettings.access.filter((element, id) => element !== event.target.id)
		setPlaylistSettings({ ...playlistSettings, access: newAccess })
	}

	/**
	 * Creates a playlist on Spotify, then stores the data about this playlist as state, builds a new playlist object with the structure and information needed for the backend and adds this new playlist to the database
	 */
	async function makePlaylist() {
		const playlistVariable = await makeSpotifyPlaylist(user.id, playlistSettings)
		setPlaylist(playlistVariable)
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
		const result = await addTrackSpotifyPlaylist(uri, playlistId)
		setPlaylist(result)
		await updatePlaylist(result);
	}

	async function updatePlaylistDetails(id, data) {
		console.log(data)
		const dataObj = {}
		for (const property in data) {
			if (data[property]) {
				dataObj[property] = data[property]
			}
		}
		const updatedPlaylist = await updateSpotifyPlaylistDetails(id, dataObj)
		console.log(updatedPlaylist)
		await updatePlaylist(updatedPlaylist)
		return updatedPlaylist;
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

	useEffect(() => {
        console.log("loading", loading)
      }, [loading])

	return <div className="root-container">
		<ClipLoader
            color="black"
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
		      /> 
		<img src="/images/cyber-mix-default-image.png" className="header-image"></img>
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
				setPlaylistAccessUser: setPlaylistAccessUser,
				removeAccessUser: removeAccessUser,
				getAllPlaylists: getAllPlaylists,
				updatePlaylistDetails: updatePlaylistDetails
			}
		} />
	</div>
}