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
    id:            UUID(),
    name:          '',
    description:   '',
    editing:       true,
    sessionId:     '',
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

function getTrackerDeleteAction(trackerId) {
  return function({trackers, sessions}, props) {
    const
      {[trackerId]: deleted, ...newTrackers} = trackers,
      newSessions                            = filterAndAssignObj(
        sessions, (session) => !(session.trackerId === trackerId))
    ;
    return {
      trackers: {
        // all of the existing trackers except for the removed one
        ...newTrackers
      },
      sessions: {
        ...newSessions
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

      newSessions            = {
        ...sessions,
        [session.id]: session
      },

      // iterate through new sessions. if session id matches tracker.id,
      // matches given then add the session duration to the total.
      totalDuration          = reduceObj(
        (total, sess) => {
          if (sess.trackerId === tracker.id) {
            const newTotal = total + sess.duration
            console.log(`found session ${JSON.stringify(sess, null, 2)} matching tracker id ${tracker.id}; total is ${newTotal}`)
            return newTotal
          } else {
            console.log(`session doesn't match tracker id ${tracker.id}:`);
            console.log(sess);
            return 0
          }
        },
        0, newSessions),

      newState               = {
        trackers: {
          // all of the other trackers
          ...trackers,
          [trackerId]: {
            // all of the existing props of the tracker
            ...tracker,
            // but with the sessionId toggled
            sessionId:     tracker.sessionId ? '' : session.id,
            totalDuration: totalDuration
          }
        },
        sessions: newSessions
      };

    console.log(newState);

    return newState;
  };
}

function reduceObj(reducer, accumulator, object) {
  return Object.keys(object).reduce(function(accumulator, key) {
    return reducer(accumulator, object[key], key, object)
  }, accumulator);
}

function filterAndAssignObj(object, filterer, assigner = (k, v) => ({[k]: v})) {
  return reduceObj(
    function(accumulator, objValue, objKey, reduceObject) {
      return filterer(objValue, reduceObject)
        ? Object.assign(accumulator, assigner(objKey, objValue))
        : accumulator
    },
    {}, object
  );
}

function getAdvanceTimeAction() {
  return function({trackers, sessions}, props) {
    const
      amountToAdvanceTimeInMS = 1000,

      trackerFilter           = (tracker) => tracker.sessionId,
      trackerAssign           = (trackerId, tracker) => ({
        [trackerId]: {
          ...tracker,
          totalDuration: tracker.totalDuration + amountToAdvanceTimeInMS
        }
      }),
      trackersInProgress      = trackers
        ? filterAndAssignObj(trackers, trackerFilter, trackerAssign) : {},

      sessionFilter           = (session) => !session.isComplete,
      sessionAssign           = (sessionId, session) => ({
        [sessionId]: {
          ...session,
          duration: session.duration + amountToAdvanceTimeInMS
        }
      }),
      sessionsInProgress      = sessions
        ? filterAndAssignObj(sessions, sessionFilter, sessionAssign) : {},

      newState                = {
        trackers: {
          ...trackers,
          ...trackersInProgress
        },
        sessions: {
          ...sessions,
          ...sessionsInProgress
        }
      };

    // console.log('getAdvanceTimeAction: after state:');
    // console.log(newState);
    return newState
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
    this.persistToDatabase     = this.persistToDatabase.bind(this);

    this.state = {
      trackers: {},
      sessions: {}
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.onAdvanceTime(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  onAuthStateChanged(user) {
    if (user) {
      // firebase TBD
      Firebase.get().then(snapshot => {
        const snapshotValue = snapshot.val();
        console.log('onAuthStateChanged retrieved database state; now setting state:');
        console.log(snapshotValue);
        this.setState((state, props) => snapshotValue)
      });

    } else {
      // user not logged in
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
    this.setState(getSaveTrackerAction(trackerToSave), this.persistToDatabase);
  }

  persistToDatabase(state) {
    // console.log('inside persistToDatabase:');
    // for some reason, even though this is called in a setState callback,
    // state is not passed, so we have to use this.state
    // console.log(state);
    // console.log(this.state);
    Firebase.set(this.state);
  }

  onAdvanceTime() {
    this.setState(getAdvanceTimeAction()
      , this.persistToDatabase
    )
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
    this.setState(getTrackerDeleteAction(trackerId), this.persistToDatabase);
  }

  onPlayPause(trackerId) {
    console.log('caught TrackList.onPlayPause:');
    this.setState(getTrackerPlayPauseToggleAction(trackerId), this.persistToDatabase);
  }

  render() {
    const
      classes     = this.props.classes,

      renderTrack = (trackerId, index) => {
        const
          tracker         = this.state.trackers[trackerId],
          session         = tracker.sessionId ? this.state.sessions[tracker.sessionId] : null,
          sessionDuration = session ? session.duration : 0
        ;
        return (
          <Grid key={index} item sm={6} xs={12}>
            {
              tracker.editing
                ? (<TrackCardEdit key={trackerId} id={trackerId} tracker={tracker}
                                  onSave={this.onSaveTrack} onCancel={this.onDeleteExistingTrack}/>)
                : (<TrackCardView key={trackerId} id={trackerId} name={tracker.name}
                                  sessionId={tracker.sessionId}
                                  onEdit={this.onStartEditTrackId} onPlayPause={this.onPlayPause}
                                  totalDuration={tracker.totalDuration}
                                  sessionDuration={sessionDuration}
                                  description={tracker.description}/>)
            }
          </Grid>
        )
      },

      trackerKeys = this.state.trackers ? Object.keys(this.state.trackers) : [],

      tracks      = trackerKeys.length > 0 ? trackerKeys.map(renderTrack) : (
        <Grid item key={'flashmessage-center'} sm={12} xs={12}>
          <Grid container className={classes.flashmessage} justify="center">
            <Grid item sm={8} xs={8}>
              <TrackMessage title="No time trackers found!" body="Click the button below to create one."/>
            </Grid>
          </Grid>
        </Grid>
      );

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