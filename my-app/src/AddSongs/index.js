export default function AddSongs({searchTracks}){
console.log("YOOOO", searchTracks)
    return <div>
        <input placeholder="Search for songs"></input>
        <button onClick={searchTracks}>Search</button>
        <button>Add Song</button>
        </div>
}

