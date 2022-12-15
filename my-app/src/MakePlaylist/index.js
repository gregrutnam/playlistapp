import { useEffect, useState } from "react";

// take the inputs for name, description and private/public
// import useState from react
// store them in useStates
//declare the states as variables, empty string in the smoothies
// using the onChange in the the input tag
// event in the smoothies
//target the event.target.value
// pass that to the function that makes the playlist - in the backend
// have the playlist created from the submit button

export default function MakePlaylist({
    playlistName,
    playlistDescription,
    playlistSetting,
    makePlaylist
}) {
  // const {playlistName, playlistDescription, handleSelect} = useOutletContext();

return (
    <div>
        <h1>Make the playlist</h1>
        <p>Name</p>
        <input onBlur={playlistName}></input>
        <p>Description</p>
        <input onBlur={playlistDescription}></input>
        <p>Select a setting</p>
        <select onChange={playlistSetting}>
        <option>Public</option>
        <option>Private</option>
        </select>
        <button onClick={makePlaylist}>Make playlist</button>
    </div>
);
}
