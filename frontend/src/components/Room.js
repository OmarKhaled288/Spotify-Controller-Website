import React, { useState } from "react";
import { useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Typography } from "@material-ui/core";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";


export default function Room() {
    
    const[votesToSkip, setVotesToSkip] = useState(2);
    const[guestCanPause, setGuestCanPause] = useState(false);
    const[isHost, setIsHost] = useState(false);
    const[showSettings, setShowSettings] = useState(false);
    const[spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
    const[song, setSong] = useState({})
    
    const { roomCode } = useParams();

    let navi = useNavigate()

    // function authenticateSpotify(){
    //   fetch('/spotify/is-authenticated')
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setSpotifyAuthenticated(data.status);
    //     if (!data.status) {
    //       fetch("/spotify/get-auth-url")
    //         .then((response) => response.json())
    //         .then((data) => {
    //           window.location.replace(data.url);
    //         });
    //     }
    //   })
    // }

    function authenticateSpotify() {
      fetch("/spotify/is-authenticated")
        .then((response) => response.json())
        .then((data) => {
          setSpotifyAuthenticated(data.status);
          console.log(data.status);
          if (!data.status) {
            fetch("/spotify/get-auth-url")
              .then((response) => response.json())
              .then((data) => {
                window.location.replace(data.url);
              });
          }
        });
    }

    fetch('/api/get-room?code='+roomCode)
    .then((response) => response.json())
    .then((data) => {
        setVotesToSkip(data.votes_to_skip);
        setGuestCanPause(data.guest_can_pause);
        setIsHost(data.is_host);
        if (isHost) {
          authenticateSpotify();
        }
    });

    useEffect(() => {
      console.log(`initializing interval`);
      const interval = setInterval(() => {
        getCurrentSong();
      }, 1000);
    
      return () => {
        console.log(`clearing interval`);
        clearInterval(interval);
      };
    }, []); 

    function getCurrentSong(){
      fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) {
          return {};
        } 
        else {
          return response.json();
        }
      })
      .then((data) => {
        setSong(data)
        console.log(data);
      });
    }

    function leaveButtonPressed() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
            navi("/");
            location.reload()
        });
    }

    function updateShowSettings(value){
      setShowSettings(value)
    }

    function renderSettings(){
      return(
        <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage update={true} votesToSkip={votesToSkip} guestCanPause={guestCanPause} roomCode={roomCode} />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}>
              Close
            </Button>
        </Grid>
      </Grid>
      );
    }

    function renderSettingsButton(){
      return(
        <Grid item xs={12} align="center">
          <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}>
            Settings
          </Button>
        </Grid>
      );
    }

    if (showSettings){
      return renderSettings();
    }

    return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Code: {roomCode}
            </Typography>
          </Grid>
          <MusicPlayer {...song}/>
          {isHost ? renderSettingsButton(): null}
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={leaveButtonPressed}
            >
              Leave Room
            </Button>
          </Grid>
        </Grid>
      );
}