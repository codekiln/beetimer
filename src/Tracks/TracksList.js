import React, {Component} from "react";
import Firebase from "../Firebase";
import {createStyleSheet, withStyles} from "material-ui/styles";
import {Button, Grid} from "material-ui";
import PropTypes from "prop-types";
import AddIcon from "material-ui-icons/Add";
import TrackMessage from "./TrackMessage";
import TrackCardView from "./TrackCardView";
import TrackCardEdit from "./TrackCardEdit";
import UUID from 'uuid/v4';
// import ModeEditIcon from 'material-ui-icons/ModeEdit';


const styleSheet = createStyleSheet('Tracks', theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
  button: {
    margin: theme.spacing.unit,
  },
  // gutter={24} direction='column' justify='flex-start' align='center'
  grid: {
    gutter: 24,
    direction: 'row'
  }
}));


class Tracks extends Component {

  constructor(props) {
    super(props);

    Firebase.setOnAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.onAddTrackClicked = this.onAddTrackClicked.bind(this);
    this.onSaveTrack = this.onSaveTrack.bind(this);

    this.state = {};
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
    const newId = UUID(),
      newTrack = {
        key: newId,
        name: '',
        description: '',
        editing: true
      };

    this.setState({[newId]: newTrack});
    console.log('caught Tracks.onAddTrackClicked');
    console.log(this.state);
  }

  onSaveTrack(tracker) {
    console.log('caught TrackList.onSaveTrack:');
    console.log(tracker);
    this.setState({[tracker.key]: { ...tracker, editing: false}});
    console.log(this.state);
  }

  render() {
    const
      classes = this.props.classes,

      renderTrack = (trackerKey, index) => {
        const tracker = this.state[trackerKey];
        return (
          <Grid key={index} item sm={6} xs={12}>
            {
              tracker.editing
              ? (<TrackCardEdit key={trackerKey} tracker={tracker} onSave={this.onSaveTrack}/>)
              : (<TrackCardView key={tracker.key} name={tracker.name} description={tracker.description}/>)
            }
          </Grid>
        )
      },

      trackerKeys = Object.keys(this.state),

      tracks = trackerKeys.length > 0 ? trackerKeys.map(renderTrack) : (
        <TrackMessage title="No time trackers found!" body="Click the button below to create one."/>
      );

    console.log('tracks rendered: ');
    console.log(tracks);
    return (
      <Grid container className={classes.grid}>
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