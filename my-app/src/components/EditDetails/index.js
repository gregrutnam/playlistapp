import { useOutletContext } from "react-router-dom"
import { useState } from "react"
import Access from "../Access"
import { updateSpotifyPlaylistDetails } from "../../functions/spotify"

export default function EditDetails(){

    const context = useOutletContext()
    const playlist = context.playlist
    const [editing, setEditing] = useState(false)
    const [newPlaylistDetails, setNewPlaylistDetails] = useState({name: playlist.name, description: playlist.description})
    const [newPlaylistImage, setNewPlaylistImage] = useState()

    function EditDetail({name}){
        return <>
            <p>{name[0].toUpperCase() + name.slice(1)}</p>
            <input name={name} onBlur={updatePlaylistDetails}></input>
        </>
    }

    function EditImage(){
        
    }

    function updatePlaylistDetails(event) {
        newPlaylistDetails[event.target.name] = event.target.value
        setNewPlaylistDetails(newPlaylistDetails)
        console.log(newPlaylistDetails)
    }

    async function saveChanges(){
       const updatedPlaylist = await context.updatePlaylistDetails(playlist.id, newPlaylistDetails)
       console.log(updatedPlaylist)
       context.setPlaylist(updatedPlaylist)
    }

    return <div className="edit-container">
                {editing ? <EditDetail name="name"/> : <div className="edit-button-container">
                    <h3>{newPlaylistDetails.name}</h3>
                    <button onClick={() => setEditing(true)}>Edit</button>
                </div>}
                {/* <input onBlur={context.playlistName}></input> */}
                {newPlaylistDetails.description ? editing ? <EditDetail name="nescription"/> : <div className="edit-button-container">
                    <h4>{playlist.description}</h4>
                    <button onClick={() => setEditing(true)}>Edit</button> </div> 
                : null}
                {editing ? <EditImage/> : <div className="edit-button-container">
                    {playlist.images.length > 0 ?
                    <img src={playlist.images[0].url} className="header-image"></img>
                    : <img src="/images/cyber-mix-default-image.png" className="header-image"></img>}
                    <button onClick={() => setEditing(true)}>Edit</button>
            </div>}
            {/* <input onBlur={context.playlistDescription}></input> */}
            {/* <div className="edit-button-container">
                <p>Share with</p>
                <button>Edit</button>
                <Access/>
            </div> */}
            {editing ? <button onClick={() => {saveChanges(); setEditing(false)}}>Save Changes</button> : null}
        </div>
}