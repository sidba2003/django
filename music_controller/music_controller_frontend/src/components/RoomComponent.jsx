import { useState, useEffect } from "react";
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

    const styles = {
        display: "flex",
        flexDirection: "column"
    }

    return (
        <div style={styles}>
            <p>{roomDetails.votes_to_skip}</p>
            <p>{String(roomDetails.guest_can_pause)}</p>
            <p>{String(roomDetails.is_host)}</p>
            <p>{roomCode}</p>
        </div>
    );
}