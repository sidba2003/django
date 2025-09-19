import { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useParams } from "react-router";
import MusicPlayerComponent from "./MusicPlayerComponent.jsx";

export default function RoomComponent() {
    const [roomDetails, setRoomDetails] = useState({});
    const [votesToSkip, setVotesToSkip] = useState(null);
    const [actualVotesToSkip, setActualVotesToSkip] = useState(null);
    const [guestControlState, setGuestControlState] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const [song, setSong] = useState(null);
    const [votes, setVotes] = useState(0);

    const actualVotesToSkipRef = useRef(null);

    const { roomCode } = useParams();

    useEffect(() => {
        actualVotesToSkipRef.current = actualVotesToSkip;
    }, [actualVotesToSkip]);

    useEffect(
        () => {
            const getRoomDetails = async () => {
                try {
                    const response = await fetch(`/api/room?code=${roomCode}`);
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }

                    const result = await response.json();
                    
                    console.log("RETRIEVED VOTES TO SKIP ARE", result.votes_to_skip);
                    setRoomDetails(result);
                    setVotesToSkip(result.votes_to_skip);
                    setActualVotesToSkip(result.votes_to_skip);
                    actualVotesToSkipRef.current = result.votes_to_skip;
                    setGuestControlState(result.guest_can_pause);

                    if (result.is_host){
                        fetch('/spotify/is_authenticated')
                            .then((response) => response.json())
                            .then((data) => {
                                setSpotifyAuthenticated(data.status);
                                if (!data.status){
                                    fetch('/spotify/get_auth_url').
                                        then((response) => response.json())
                                        .then((data) => {
                                            window.location.replace(data.url);
                                        })
                                }
                            }
                        )
                    }
                } catch (error) {
                    console.error(error.message);
                }

                getCurrentSong();
            }

            getRoomDetails();

            const intervalId = setInterval(getCurrentSong, 1500);
            const intervalId2 = setInterval(getCurrentSkipVotes, 1000);
            const intervalId3 = setInterval(getRoomDetailsAtIntervals, 500);

            return () => {
                clearInterval(intervalId);
                clearInterval(intervalId2);
                clearInterval(intervalId3);
            };
        }
    , []);

    async function getRoomDetailsAtIntervals(){
        try {
            const response = await fetch(`/api/room?code=${roomCode}`);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            setRoomDetails(result);
            setActualVotesToSkip(result.votes_to_skip);
            actualVotesToSkipRef.current = result.votes_to_skip;
            setGuestControlState(result.guest_can_pause);
        } catch (error) {
            console.error(error.message);
        }
    }

    async function handleLeaveRoom() {
        try {
            const response = await fetch("/api/user_room/", { method: 'DELETE' });
            if (response.ok) {
                window.location.href = "/";
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    async function getCurrentSong(){
        fetch('/spotify/current_song')
            .then((response) => {
                if (!response.ok){
                    return {};
                } else {
                    return response.json();
                }
            })
            .then((data) => {
                setSong(data)
            })
    }

    function handeGuesControlChange(event){
        setGuestControlState(event.target.value);
    }

    function handleVotesChange(event) {
        setVotesToSkip(Number(event.target.value));
    }

    async function handleEditRoom() {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                guest_can_pause: guestControlState,
                votes_to_skip: votesToSkip,
                code: roomCode
            })
        }

        try {
            setActualVotesToSkip(votesToSkip);
            actualVotesToSkipRef.current = votesToSkip;

            const response = await fetch('/api/user_room/', requestOptions);
            const data = await response.json();

            if (!response.ok){
                var error = new Error('Error- ' + response.status + ":" + response.statusText);
                error.response = response;
                throw error;
            }

            console.log('new room data =>', data);
        } catch (error) {
            console.error(error.message);
        }  
    }

    async function pauseOrPlay(){
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        }

        const endpoint = song.is_playing ? '/spotify/pause' : '/spotify/play';

        try {
            const response = await fetch(endpoint, requestOptions);

            if (!response.ok){
                var error = new Error('Error- ' + response.status + ":" + response.statusText);
                error.response = response;
                throw error;
            }

        } catch (error) {
            console.error(error.message);
        }
    }

    async function skipSong() {
        if (roomDetails.is_host){
            await nextSong();
        } else {
            await incrementSkipVotes();
        }
    }

    async function getCurrentSkipVotes(){
        console.log("Votes to skip are", Number(actualVotesToSkipRef.current));
        const needed = Number(actualVotesToSkipRef.current);
        if (!Number.isFinite(needed)) return;

        const response = await fetch('/api/current_votes/');
        const result = await response.json();

        setVotes(result.current_votes);

        if (result.current_votes >= needed) {
            await nextSong();
        }
    }


    async function resetSkipVotes() {
        const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        };
        
        try {
            await fetch('/api/current_votes/', requestOptions);
        } catch (error) {
            console.error(error.message);
        } 
    }

    async function incrementSkipVotes() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'}
        };
        
        try {
            await fetch('/api/current_votes/', requestOptions);
        } catch (error) {
            console.error(error.message);
        } 
    }

    async function nextSong(){
        await resetSkipVotes();

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        };
        
        try {
            await fetch('/spotify/skip', requestOptions);
            console.log("Attempted To Get Next Song!!");
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Grid container direction="column" spacing={1}>
            <grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </grid>
            {song !== null && song !== '' ? <MusicPlayerComponent {...{...song, votes:votes}} pauseOrPlay={pauseOrPlay} votesToSkip={actualVotesToSkip} skipSong={skipSong} /> : null}
            { 
            showSettings 
            ?
                <>
                    <grid item align="center">
                        <FormControl component="fieldset">
                            <FormHelperText>
                                <div align="center">Guest Control of Playback State</div>
                            </FormHelperText>
                                <RadioGroup row onChange={handeGuesControlChange} defaultValue={String(guestControlState)}>
                                    <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
                                    <FormControlLabel value="false" control={<Radio color="secondary" />} label="No control" labelPlacement="bottom" />
                                </RadioGroup>
                        </FormControl>
                    </grid>

                    <grid item align="center">
                        <FormControl>
                            <TextField onChange={handleVotesChange} required type="number" defaultValue={votesToSkip}
                                inputProps={{ min: 1, style: { textAlign: "center" } }} />
                            <FormHelperText>
                                <div align="center">Votes required to skip Song</div>
                            </FormHelperText>
                        </FormControl>
                    </grid>
                    <grid item align="center">
                        <Button color="secondary" onClick={handleEditRoom} variant="contained">
                            Edit Room Settings
                        </Button>
                    </grid>
                </>
            :
                null
            }
            {
                roomDetails.is_host ?
                    <grid item xs={12} align="center">
                        <Button variant="contained" color="primary" onClick={() => setShowSettings((prev) => !prev)}>
                            {!showSettings ? "Show Settings" : "Close Settings"}
                        </Button>
                    </grid>
                :
                    null
            }
            <grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={handleLeaveRoom}>
                    Leave Room
                </Button>
            </grid>
        </Grid>
    );
}