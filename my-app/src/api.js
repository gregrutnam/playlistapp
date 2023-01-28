/** Get all playlists from database
 * @return An array of playlists
 */
export async function getPlaylists() {
    const response = await fetch('http://localhost:3001/api/playlists')
    const data = await response.json();
    return data.payload;
}

/** Get playlist by id (integer) from database 
 * @param id integer
 * @return The playlist
*/
export async function getPlaylistById(id){
    const response = await fetch(`http://localhost:3001/api/playlists/${id}`)
    const data = await response.json()
    return data.payload[0]
}

/** Add new playlist to database
 * @param playlist playlist_id: string, name: string, link: string, created_by: string, tracks: string[], date: string, access: string[]
 * @return The newly added playlist
 */
export async function postPlaylist(playlist) {
    const playlistObject = {
        playlist_id: playlist.playlist_id,
        name: playlist.name,
        link: playlist.link,
        created_by: playlist.created_by,
        tracks: playlist.tracks,
        date: playlist.date,
        access: playlist.access
      }
    const response = await fetch('http://localhost:3001/api/playlists',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistObject)
    })
    const data = await response.json()
    return data.payload;
}

/** Update an existing playlist in the database
 * @param id integer
 * @param playlist playlist_id: string, name: string, link: string, created_by: string, tracks: string[], date: string, access: string[]
 */
export async function updatePlaylist(id, playlist) {
    const playlistData = await getPlaylistById(id);
    const tracksArr = [...playlist.tracks.items.map(item => {
        const trackObj = {
            artist: item.track.artists[0].name,
            id: item.track.id,
            name: item.track.name,
            album: item.track.album.name,
            image: item.track.album.images[2].url
        }
        return trackObj
    })]
    const playlistObj = {
        playlist_id: playlistData.playlist_id,
        name: playlistData.name,
        link: playlistData.link,
        created_by: playlistData.created_by,
        tracks: tracksArr,
        date: playlistData.date,
        access: playlistData.access
    }
    await fetch(`http://localhost:3001/api/playlists/${id}`,
    {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistObj)
    })
}