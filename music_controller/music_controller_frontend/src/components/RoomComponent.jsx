import { useState, useEffect } from "react";
import { Grid, Button, Typography } from '@mui/material';
import { useParams } from "react-router";

export default function RoomComponent() {
    const [roomDetails, setRoomDetails] = useState({});

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

    return (
        <Grid container direction="column" spacing={1}>
            <grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </grid>
            <grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Votes to Skip: {roomDetails.votes_to_skip}
                </Typography>
            </grid>
            <grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Is Host: {String(roomDetails.is_host)}
                </Typography>
            </grid>
            <grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </grid>
            <grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={handleLeaveRoom}>
                    Leave Room
                </Button>
            </grid>
        </Grid>
    );
}