import { Grid, Button, ButtonGroup, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function HomePageComponent() {
    useEffect(() => {
        const fetchUserRoom = async() => {
            try {
                    const response = await fetch("/api/user_room/");
                    const result = await response.json();
                    if (result.user_room !== null) {
                        window.location.href = `room/${result.user_room}`
                    }
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchUserRoom()
    }, [])

    return (
        <Grid container direction="column" spacing={3}>
            <Grid item xs={12} align="center">
                <Typography variant="h3" compact="h3">
                    House Party
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <ButtonGroup disableElevation variant='contained' color='primary'>
                    <Button color='primary' to='join_room' component={ Link }>
                        Join a Room
                    </Button>
                    <Button color='secondary' to='create_room' component={ Link }>
                        Create a Room
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );
}