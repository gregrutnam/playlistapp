/** Get all playlists from database
 * @return An array of playlists
 */
export async function getPlaylists() {
    const response = await fetch('https://cybermix-backend.onrender.com/api/playlists')
    const data = await response.json();
    return data.payload;
}

/** Get playlist by id string from database 
 * @param id string
 * @return The playlist
*/
export async function getPlaylistById(id){
    const response = await fetch(`https://cybermix-backend.onrender.com/api/playlists/${id}`)
    const data = await response.json()
    return data.payload
}

/** Add new playlist to database
 * @param playlist playlist_id: string, name: string, link: string, created_by: string, tracks: string[], date: string, access: string[]
 * @return The newly added playlist
 */
export async function postPlaylist(playlist) {
    console.log("hi!", playlist)
    const response = await fetch('https://cybermix-backend.onrender.com/api/playlists',
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
    console.log("HI")
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
    let playlistImage = ""
    if (playlist.images.length > 0) {
        playlistImage = playlist.images[0].url
    }
    else {
        playlistImage = "/images/cyber-mix-default-image.png"
    }
    const playlistObj = {
        playlist_id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlistImage,
        link: playlistData.link,
        created_by: playlistData.created_by,
        tracks: tracksArr,
        date: playlistData.date,
        access: playlistData.access
    }
    console.log(playlistObj)
    await fetch(`https://cybermix-backend.onrender.com/api/playlists/${playlist.id}`,
    {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playlistObj)
    })
}