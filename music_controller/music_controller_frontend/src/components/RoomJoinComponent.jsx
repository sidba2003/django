import { TextField, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from 'react';

export default function RoomJoinComponent() {
    const [roomCode, setRoomCode] = useState("");
    const [error, setError] = useState("");

    async function handleRoomJoin() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                code: roomCode
            })
        };
        
        try {
            const response = await fetch(`/api/join_room/`, requestOptions);
            if (response.ok){
                const result = await response.json();
                window.location.href = `/room/${roomCode}`
            } else {
                setError(response.statusText);
            }
        } catch (error) {
            console.error(error.message);
        }   
    }

    function handleTextFieldChange(event) {
        setRoomCode(event.target.value);
    }

    return (
        <Grid container direction="column" spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField 
                    error={error}
                    label="Code"
                    placeholder="Enter a Room Code"
                    value={roomCode}
                    helperText={error}
                    variant="outlined"
                    onChange={handleTextFieldChange}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={handleRoomJoin}>
                    Join Room
                </Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>
                    Back
                </Button>
            </Grid>
        </Grid>
    );
}