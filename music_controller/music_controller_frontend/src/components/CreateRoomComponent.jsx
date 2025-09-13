import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import { useState } from "react";

export default function CreateRoomComponent() {
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesRequired, setVotesRequired] = useState(1);

    const defaultVotes = 1;

    function handleVotesChange(event) {
        setVotesRequired(event.target.value);
    }

    function handeGuesControlChange(event){
        setGuestCanPause(event.target.value);
    }

    function handleCreateRoom() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesRequired,
                guest_can_pause: guestCanPause
            })
        };

        fetch('/api/create_room/', requestOptions)
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    return (
        <Container maxWidth="sm" sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
            <Paper sx={{ p: 3, width: "100%" }} elevation={3}>
                <Grid container direction="column" spacing={2} alignItems="center">
                    <Grid item>
                        <Typography component="h4" variant="h4">Create a Room</Typography>
                    </Grid>

                    <Grid item>
                        <FormControl component="fieldset">
                            <FormHelperText>
                                <div align="center">Guest Control of Playback State</div>
                            </FormHelperText>
                            <RadioGroup row onChange={handeGuesControlChange} defaultValue="true">
                                <FormControlLabel value="true" control={<Radio color="primary" />} label="Play/Pause" labelPlacement="bottom" />
                                <FormControlLabel value="false" control={<Radio color="secondary" />} label="No control" labelPlacement="bottom" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl>
                            <TextField onChange={handleVotesChange} required type="number" defaultValue={defaultVotes}
                                inputProps={{ min: 1, style: { textAlign: "center" } }} />
                            <FormHelperText>
                                <div align="center">Votes required to skip Song</div>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <Button color="secondary" onClick={handleCreateRoom} variant="contained">
                            Create a Room
                        </Button>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="contained" to="/" component={Link}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
