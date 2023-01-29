export default function Track({image, name, artist, album, uri, playlist, buttonFunction, buttonText}) {
    return <div className="add-song">
        <img src={image}></img>
        <div className="add-songs-info">
            <p>{name} - {artist}
                <br></br>
                {album}
            </p>
        </div>
        <button
            onClick={() => buttonFunction(uri, playlist.id)}>{buttonText}
        </button>
    </div>
}