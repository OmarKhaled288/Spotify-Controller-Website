import React, { Component } from "react";
import { Link } from "react-router-dom";
import {withRouter} from './withRouter';
import { TextField, Button, Grid, Typography, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel } from "@material-ui/core";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert"

class CreateRoomPage extends Component{
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    };

    constructor(props) {
        super(props);
        this.state = {
          guestCanPause: this.props.guestCanPause,
          votesToSkip: this.props.votesToSkip,
          errorMsg: "",
          successMsg: ""
        };
    
        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handelVotesChange = this.handelVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handelUpdateButtonPressed = this.handelUpdateButtonPressed.bind(this);
    }

    handelVotesChange(e){
        this.setState({
            votesToSkip: e.target.value,
        });
    }

    handleGuestCanPauseChange(e) {
        this.setState({
          guestCanPause: e.target.value === "true" ? true : false,
        });
    }

    handleRoomButtonPressed() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            votes_to_skip: this.state.votesToSkip,
            guest_can_pause: this.state.guestCanPause,
          }),
        };
        fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.navigate("/room/" + data.code));
      }

    renderCreateButtons(){
        return(
            <Grid container spacing={1}>
              <Grid item xs={12} align="center">
              <Button color="primary" variant="contained" onClick={this.handleRoomButtonPressed}>
                Create A Room
              </Button>
              </Grid>
              <Grid item xs={12} align="center">
              <Button color="secondary" variant="contained" to="/" component={Link}>
                Back
              </Button>
              </Grid>
            </Grid>
        );
    }

    handelUpdateButtonPressed(){
        const requestOptions = {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              votes_to_skip: this.state.votesToSkip,
              guest_can_pause: this.state.guestCanPause,
              code: this.props.roomCode
            }),
          };
        fetch("/api/update-room", requestOptions)
        .then((response) => {
            if (response.ok){
                this.setState({
                    successMsg: "Saved"
                })
            }
            else{
                this.setState({
                    errorMsg: "Error"
                })
            }
        });
    }

    renderUpdateButtons(){
        return(
            <Grid item xs={12} align="center">
              <Button color="primary" variant="contained" onClick={this.handelUpdateButtonPressed}>
                Save
              </Button>
              </Grid>
        );
    }

    render(){
        const title = this.props.update ? "Settings" : "Create a Room"

        return(
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography component="h4" variant="h4">
                        {title}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl component='fieldset'>
                        <FormHelperText>
                            <div align="Center">
                                Guest Control Of Playback State
                            </div>
                        </FormHelperText>
                        <RadioGroup row defaultValue={String(this.props.guestCanPause)} onChange={this.handleGuestCanPauseChange}>
                            <FormControlLabel value="true" control={<Radio color="primary"/>} label= "Play/Pause" lablePlacement="bottom"/>
                            <FormControlLabel value="false" control={<Radio color="secondary"/>} label= "No Control" lablePlacement="bottom"/>
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid item xs={12} align="center">
                    <FormControl>
                        <TextField required={true} type="number" defaultValue={this.state.votesToSkip} inputProps={{min:1, style:{textAlign:"center"}}} onChange={this.handelVotesChange}/>
                        <FormHelperText>
                            <div align="Center">
                                Votes Required To Skip Song
                            </div>
                        </FormHelperText>
                    </FormControl>
                </Grid>
                {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
            </Grid>
        );
    }
}
export default withRouter(CreateRoomPage);