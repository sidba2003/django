export default function MusicPlayerComponent(props){
    return (
        <div className="music-player-class">
            <img className="album-cover-class" src={props.image_url} />
            <div className="song-name-class">{props.title}</div>
            <div className="artist-name-class">{props.artist}</div>
            <div className="completed-class">Time Left: {Math.ceil((props.duration - props.time) / 1000)}</div>
            <div className="is-playing-class">{props.is_playing ? "Playing Right Now": "Paused"}</div>
            <div className="votes-class">votes: {props.votes} / {props.votesToSkip}</div>
            <button onClick={props.pauseOrPlay}>
                {props.is_playing ? "Pause" : "Play"}
            </button>
            <button onClick={props.skipSong}>
                Skip
            </button>
        </div>
    );
}