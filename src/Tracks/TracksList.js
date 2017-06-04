import React, {Component} from 'react';
import Firebase from '../Firebase'
import {createStyleSheet, withStyles} from "material-ui/styles";
import {Button, Grid, Paper, Typography} from "material-ui";
import PropTypes from "prop-types";
import AddIcon from 'material-ui-icons/Add';
import TrackListItem from "./TrackListItem";
// import ModeEditIcon from 'material-ui-icons/ModeEdit';


const styleSheet = createStyleSheet('Tracks', theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
  button: {
    margin: theme.spacing.unit,
  },
}));


class Tracks extends Component {

  constructor(props) {
    super(props);

    Firebase.setOnAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.onAddTrackClicked = this.onAddTrackClicked.bind(this);

    this.state = {
      tracks: [],
    };
  }

  componentDidMount() {

  }

  onAuthStateChanged(user) {
    if (user) {
      //
      // this.setState({
      //   userName: user.displayName,
      //   userProfilePicUrl: user.photoURL
      // });
    } else {
      // this.setState({
      //   userName: '',
      //   userProfilePicUrl: ''
      // });
    }
    console.log('caught Tracks.onAuthStateChanged');
    console.log(this.state);
  }

  onAddTrackClicked() {
    console.log('caught Tracks.onAddTrackClicked');
  }

  render() {
    const classes = this.props.classes;
    const tracks = this.state.tracks.length ?
      this.state.tracks.map(function (tracker) {
        return (
          <TrackListItem title={tracker.name} body={tracker.description}/>
        );
      }) : (
        <TrackListItem title="No time trackers found!" body="Add a time tracker below to get started."/>
      );
    return (
      <Grid container gutter={24} direction='column' justify='flex-start' align='center'>
        {tracks}
        <Grid item xs={11}>
          <Button fab accent className={classes.button} onClick={this.onAddTrackClicked}>
            <AddIcon />
          </Button>
        </Grid>
      </Grid>
    )
  }
}

Tracks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(Tracks);