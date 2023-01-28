export default function Track({image, name, artist, album, id, buttonFunction, buttonText}) {
    return <div className="add-song">
        <img src={image}></img>
        <div className="add-songs-info">
            <p>{name} - {artist}
                <br></br>
                {album}
            </p>
        </div>
        <button
            id={id}
            onClick={() => buttonFunction(id)}>{buttonText}
        </button>
    </div>
}