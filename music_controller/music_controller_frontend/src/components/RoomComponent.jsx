import { useState, useEffect } from "react";
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

export default function RoomComponent() {
    const [roomDetails, setRoomDetails] = useState({});
    const [votesToSkip, setVotesToSkip] = useState(0);
    const [guestControlState, setGuestControlState] = useState(null);
    const [showSettings, setShowSettings] = useState(false);

    const { roomCode } = useParams();

    useEffect(
        () => {
            const getRoomDetails = async () => {
                try {
                    const response = await fetch(`/api/room?code=${roomCode}`);
                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`);
                    }

                    const result = await response.json();

                    setRoomDetails(result);
                    setVotesToSkip(result.votes_to_skip);
                    setGuestControlState(result.guest_can_pause);
                } catch (error) {
                    console.error(error.message);
                }
            }

            getRoomDetails();
        }
    , []);

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

    function handeGuesControlChange(event){
        setGuestControlState(event.target.value);
    }

    function handleVotesChange(event) {
        setVotesToSkip(event.target.value);
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

    return (
        <Grid container direction="column" spacing={1}>
            <grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </grid>
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