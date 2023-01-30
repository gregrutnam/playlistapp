import SpotifyWebApi from "spotify-web-api-js";

export const authEndpoint = "https://accounts.spotify.com/authorize";

const redirectUri = "http://localhost:3000/callback"

const clientId = "593d7fe3d674485392669714b0241c96"

export const spotify = new SpotifyWebApi();

const scopes = [
    "user-read-private", 
    "user-read-email", 
    "user-top-read", 
    "playlist-modify-public", 
    "playlist-modify-private"
]

export const loginUrl = `${authEndpoint}?
client_id=${clientId}
&redirect_uri=${redirectUri}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`

export const getTokenFromUrl = () =>{
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial, item) =>{
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1])
            return initial
        }, {});
}

export async function getSpotifyPlaylist(id){
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    const spotifyPlaylist = await spotify.getPlaylist(id)
    return spotifyPlaylist
}

/**
* This function makes a POST request to Spotify's API that creates a playlist using the id of the user who's currently logged in and the playlist settings
* @param userId string
* @param playlistSettings name: string, description: string, public: boolean
* @return The new playlist if playlistSettings.name, nothing otherwise
*/

export async function makeSpotifyPlaylist(userId, playlistSettings) {
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    let data = {
       name: playlistSettings.name,
       description: playlistSettings.description,
       //DOESN'T WORK RIGHT NOW
       public: playlistSettings.settings,
    };
    if (playlistSettings.name.length > 0) {
       let playlistVariable = await spotify.createPlaylist(userId, data);
       return playlistVariable;
    }
}

/** This function makes a PATCH request to Spotify's API that updates a playlist using its id 
 * @param uri string
 * @param playlistId string
 * @return The updated playlist
*/
export async function addTrackSpotifyPlaylist(uri, playlistId) {
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    const options = { position: 0 };
    await spotify.addTracksToPlaylist(
        playlistId,
        [uri],
        options
    )
    const result = await spotify.getPlaylist(playlistId)
    return result;
}

/** This function makes a PATCH request to Spotify's API and removes a track from a playlist given the playlist's id and the track's uri
 * @param name string
 * @param id string
 * @param uri string
  */
 export async function deleteTrackSpotify(name, id, uri) {
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
        await spotify.removeTracksFromPlaylist(id, [uri])
        let updatedPlaylist = await spotify.getPlaylist(id)
        return updatedPlaylist;
    }
}

/** Searches for tracks matching a given search term
 * @param query string
 */
export async function searchTracksSpotify(query){
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    const options = { limit: 50 }
    let result = await spotify.searchTracks(query, options)
    return result;
}

/** Changes the details of a playlist
 * @param id string
 * @param data object {name: string, description: string, public: boolean}
 */
export async function updateSpotifyPlaylistDetails(id, data){
    console.log(data)
    const dataObj = {}
    for (const property in data) {
        if (data[property]) {
            dataObj[property] = data[property]
        }
    }
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    console.log(dataObj)
    await spotify.changePlaylistDetails(id, dataObj)
    const result = await spotify.getPlaylist(id)
    return result;
}

/** Change the image associated with a Spotify playlist
 * @param id The id of the playlist
 * @param image Base64 encoded JPEG image data, maximum payload size is 256 KB.
 */
export async function updateSpotifyImage(id, image){
    spotify.setAccessToken(localStorage.getItem('spotifyToken'));
    spotify.uploadCustomPlaylistCoverImage(id, image)
}