/** Get all playlists from database
 * @return An array of playlists
 */
export async function getPlaylists() {
    const response = await fetch('http://localhost:3001/api/playlists')
    const data = await response.json();
    return data.payload;
}

/** Get playlist by id string from database 
 * @param id string
 * @return The playlist
*/
export async function getPlaylistById(id){
    const response = await fetch(`http://localhost:3001/api/playlists/${id}`)
    const data = await response.json()
    return data.payload
}

/** Add new playlist to database
 * @param playlist playlist_id: string, name: string, link: string, created_by: string, tracks: string[], date: string, access: string[]
 * @return The newly added playlist
 */
export async function postPlaylist(playlist) {
    console.log("hi!", playlist)
    const response = await fetch('http://localhost:3001/api/playlists',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlist)
    })
    const data = await response.json()
    return data.payload;
}

/** Update an existing playlist in the database
 * @param playlist
 */
export async function updatePlaylist(playlist) {
    const playlistData = await getPlaylistById(playlist.id);
    console.log(playlist.id)
    const tracksArr = [...playlist.tracks.items.map(item => {
        const trackObj = {
            id: item.track.id,
            name: item.track.name,
            artist: item.track.artists[0].name,
            album: item.track.album.name,
            image: item.track.album.images[2].url,
            comment: "",
            author: "",
            date: "",
        }
        return trackObj
    })]
    const playlistObj = {
        playlist_id: playlistData.playlist_id,
        name: playlistData.name,
        description: playlistData.description,
        image: playlist.images[0].url,
        link: playlistData.link,
        created_by: playlistData.created_by,
        tracks: tracksArr,
        date: playlistData.date,
        access: playlistData.access
    }
    await fetch(`http://localhost:3001/api/playlists/${playlist.id}`,
    {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistObj)
    })
}