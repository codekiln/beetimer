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
  }))
;

function getNewTracker() {
  return {
    id:          UUID(),
    name:        '',
    description: '',
    editing:     true,
    sessionId:   '',
    totalDuration: 0
  }
}

function getStartedSession(trackerId) {
  return {
    id:         UUID(),
    trackerId:  trackerId,
    startedAt:  Date.now(),
    duration:   0,
    isComplete: false
  }
}

function getFinishedSession(sessionObj) {
  return {
    ...sessionObj,
    duration:   Date.now() - sessionObj.startedAt,
    isComplete: true
  }
}

function getAddTrackerAction() {
  return function({trackers}, props) {
    const newTracker = getNewTracker();
    return {
      trackers: {
        ...trackers,
        [newTracker.id]: newTracker
      }
    }
  };
}

function getSaveTrackerAction(tracker) {
  return function({trackers}, props) {
    return {
      trackers: {
        // all the existing tracks
        ...trackers,
        // plus the new saved tracker
        [tracker.id]: tracker
      }
    };
  };
}

// TODO: delete sessions upon deleting tracker
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

function getTrackerPlayPauseToggleAction(trackerId) {
  return function({trackers, sessions}, props) {
    const
      {[trackerId]: tracker} = trackers,
      session                = tracker.sessionId
        ? getFinishedSession(sessions[tracker.sessionId])
        : getStartedSession(trackerId),
      newState               = {
        trackers: {
          // all of the other trackers
          ...trackers,
          [trackerId]: {
            // all of the existing props of the tracker
            ...tracker,
            // but with the sessionId toggled
            sessionId: tracker.sessionId ? '' : session.id
          }
        },
        sessions: {
          ...sessions,
          [session.id]: session
        }
      };
    console.log(newState);
    debugger;

    return newState;
  };
}

class Tracks extends Component {

  constructor(props) {
    super(props);

    Firebase.setOnAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.onAddTrackClicked     = this.onAddTrackClicked.bind(this);
    this.onSaveTrack           = this.onSaveTrack.bind(this);
    this.onStartEditTrackId    = this.onStartEditTrackId.bind(this);
    this.onDeleteExistingTrack = this.onDeleteExistingTrack.bind(this);
    this.onPlayPause           = this.onPlayPause.bind(this);

    this.state = {
      trackers: {},
      sessions: {}
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
    this.setState(getAddTrackerAction());
    console.log('caught Tracks.onAddTrackClicked');
    console.log(this.state);
  }

  onSaveTrack(tracker) {
    const trackerToSave = {
      ...tracker,
      editing: false
    };
    console.log('caught TrackList.onSaveTrack:');
    console.log(trackerToSave);
    this.setState(getSaveTrackerAction(trackerToSave));
  }

  onStartEditTrackId(trackerId) {
    const trackerToEdit = {
      ...this.state.trackers[trackerId],
      editing: true
    };
    console.log('caught TrackList.onStartEditTrackId:');
    this.setState(getSaveTrackerAction(trackerToEdit), state => console.log(state));
  }

  onDeleteExistingTrack(trackerId) {
    console.log('caught TrackList.onDeleteExistingTrack:');
    this.setState(getTrackerDeleteAction(trackerId), state => console.log(state));
  }

  onPlayPause(trackerId) {
    console.log('caught TrackList.onPlayPause:');
    this.setState(getTrackerPlayPauseToggleAction(trackerId), state => console.log(state));
  }

  render() {
    const
      classes     = this.props.classes,

      renderTrack = (trackerId, index) => {
        const tracker = this.state.trackers[trackerId];
        return (
          <Grid key={index} item sm={6} xs={12}>
            {
              tracker.editing
                ? (<TrackCardEdit key={trackerId} id={trackerId} tracker={tracker}
                                  onSave={this.onSaveTrack} onCancel={this.onDeleteExistingTrack}/>)
                : (<TrackCardView key={trackerId} id={trackerId} name={tracker.name} sessionId={tracker.sessionId}
                                  onEdit={this.onStartEditTrackId} onPlayPause={this.onPlayPause}
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