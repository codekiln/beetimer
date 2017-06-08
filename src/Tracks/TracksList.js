import React, {Component} from 'react';
import Firebase from '../Firebase';
import {createStyleSheet, withStyles} from 'material-ui/styles';
import {Button, Grid} from 'material-ui';
import PropTypes from 'prop-types';
import AddIcon from 'material-ui-icons/Add';
import TrackMessage from './TrackMessage';
import TrackCardView from './TrackCardView';
import TrackCardEdit from './TrackCardEdit';
import UUID from 'uuid/v4';
// import ModeEditIcon from 'material-ui-icons/ModeEdit';


const
  styleSheet = createStyleSheet('Tracks', theme => ({
    root:         {
      flexGrow:  1,
      marginTop: 30
    },
    button:       {
      margin: theme.spacing.unit,
    },
    grid:         theme.mixins.gutters({
      flexGrow:  1,
      marginTop: 30
    }),
    flashmessage: {
      justify: 'center',
    }
  }));

function getSaveTrackerAction(tracker, isStillEditing = false) {
  return function({trackers}, props) {
    return {
      trackers: {
        // all the existing tracks
        ...trackers,
        // plus the new saved tracker
        [tracker.key]: {
          ...tracker,
          editing: isStillEditing
        }
      }
    };
  };
}

function getTrackerDeleteAction(trackerId) {
  return function({trackers}, props) {
    const {[trackerId]: deleted, ...newTrackers} = trackers;
    return {
      trackers: {
        // all of the existing trackers except for the removed one
        ...newTrackers
      }
    };
  }
}

class Tracks extends Component {

  constructor(props) {
    super(props);

    Firebase.setOnAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.onAddTrackClicked = this.onAddTrackClicked.bind(this);
    this.onSaveTrack       = this.onSaveTrack.bind(this);
    this.onCancelNewTrack  = this.onCancelNewTrack.bind(this);
    this.onDeleteExistingTrack  = this.onDeleteExistingTrack.bind(this);

    this.state = {
      trackers: {}
    };
  }

  componentDidMount() {

  }

  onAuthStateChanged(user) {
    if (user) {
      // firebase TBD
    } else {
      // firebase TBD
    }
    console.log('caught Tracks.onAuthStateChanged');
    console.log(this.state);
  }

  onAddTrackClicked() {
    const newId      = UUID(),
          newTracker = {
            key:         newId,
            name:        '',
            description: '',
            editing:     true
          };

    this.setState(getSaveTrackerAction(newTracker, true));
    console.log('caught Tracks.onAddTrackClicked');
    console.log(this.state);
  }

  onSaveTrack(tracker) {
    console.log('caught TrackList.onSaveTrack:');
    console.log(tracker);
    this.setState(getSaveTrackerAction(tracker));
  }

  onCancelNewTrack(trackerId) {
    console.log('caught TrackList.onCancelNewTrack:');
    this.setState(getTrackerDeleteAction(trackerId));
  }

  onDeleteExistingTrack(trackerId) {
    console.log('caught TrackList.onDeleteExistingTrack:');
    this.setState(getTrackerDeleteAction(trackerId));
  }

  render() {
    const
      classes     = this.props.classes,

      renderTrack = (trackerKey, index) => {
        const tracker = this.state.trackers[trackerKey];
        return (
          <Grid key={index} item sm={6} xs={12}>
            {
              tracker.editing
                ? (<TrackCardEdit key={trackerKey} id={trackerKey} tracker={tracker}
                                  onSave={this.onSaveTrack} onCancel={this.onCancelNewTrack}/>)
                : (<TrackCardView key={trackerKey} id={trackerKey} name={tracker.name} onDelete={this.onDeleteExistingTrack}
                                  description={tracker.description}/>)
            }
          </Grid>
        )
      },

      trackerKeys = Object.keys(this.state.trackers),

      tracks      = trackerKeys.length > 0 ? trackerKeys.map(renderTrack) : (
        <Grid item key={'flashmessage-center'} sm={12} xs={12}>
          <Grid container className={classes.flashmessage} justify="center">
            <Grid item sm={8} xs={8}>
              <TrackMessage title="No time trackers found!" body="Click the button below to create one."/>
            </Grid>
          </Grid>
        </Grid>
      );

    console.log('tracks rendered');
    return (
      <Grid container className={classes.grid}>
        {tracks}
        <Grid item xs={12}>
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