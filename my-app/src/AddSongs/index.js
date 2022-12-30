import {useEffect} from "react";



export default function AddSongs({searchTracks, addTracks, handleQuery, results, playlist}){
    useEffect(()=>{console.log("this is the playlist in addsongs", playlist)},[playlist])
    return <div>
        <input onChange={handleQuery} placeholder="Search for songs"></input>
        <button onClick={searchTracks}>Search</button>
        {results.length > 0 ? results.map(result => <><p>{result.name} - {result.artists[0].name}</p> <button id={result.uri} onClick={addTracks}>Add Song</button></>) : null}
        </div>
}

