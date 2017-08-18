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
    id:                       UUID(),
    name:                     '',
    description:              '',
    editing:                  true,
    sessionId:                '',
    _sessionElapsed:          0,
    // the total duration BEFORE the session if any
    completedSessionDuration: 0
  }
}


function getStartedSession(trackerId) {
  return {
    id:            UUID(),
    trackerId:     trackerId,
      // TODO: use Firebase.ServerValue.TIMESTAMP here
    startedAt:     Date.now(),
    _elapsed:      0,
    // will be zero until finished
    finalDuration: 0
  }
}


function getFinishedSession(sessionObj) {
  return {
    ...sessionObj,
    _elapsed:      0,
    finalDuration: Date.now() - sessionObj.startedAt
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
      {[trackerId]: tracker}   = trackers,

      session                  = tracker.sessionId
        ? getFinishedSession(sessions[tracker.sessionId])
        : getStartedSession(trackerId),

      newSessions              = {
        ...sessions,
        [session.id]: session
      },

      // iterate through new sessions. if session id matches tracker.id,
      // matches given then add the session duration to the total.
      completedSessionDuration = reduceObj(
        (total, sess) => (sess.trackerId === tracker.id)
          ? total + sess.finalDuration : total,
        0, newSessions),

      newState                 = {
        trackers: {
          // all of the other trackers
          ...trackers,
          [trackerId]: {
            // all of the existing props of the tracker
            ...tracker,
            // but with the sessionId toggled
            sessionId:                tracker.sessionId ? '' : session.id,
            _sessionElapsed:          session._elapsed,
            completedSessionDuration: completedSessionDuration
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

/**
 * TracksList.onComponentDidMount() gives this function an opportunity to
 * change state every second. It calculates the local time elapsed of each
 * in-progress timer, calculating it in session._elapsed and
 * tracker._sessionElapsed. These properties are not persisted to firebase;
 * they are for local display only.
 * @returns {Function}
 */
function getAdvanceTimeAction() {
  return function({trackers, sessions}, props) {
    const
      // only the sessions with final duration equal to zero are in progress
      sessionFilter      = (session) => session.finalDuration === 0,
      sessionAssign      = (sessionId, session) => ({
        [sessionId]: {
          ...session,
          _elapsed: Date.now() - session.startedAt
        }
      }),
      sessionsInProgress = sessions
        ? filterAndAssignObj(sessions, sessionFilter, sessionAssign) : {},

      trackerFilter      = (tracker) => tracker.sessionId,
      trackerAssign      = (trackerId, tracker) => {
        const
          // get the elapsed duration for this in progress tracker
          _sessionElapsed = reduceObj(
            (total, sess) => (sess.trackerId === tracker.id)
              ? total + sess._elapsed : total,
            0, sessionsInProgress);

        return {
          [trackerId]: {
            ...tracker,
            _sessionElapsed: _sessionElapsed
          }
        }
      },
      trackersInProgress = trackers
        ? filterAndAssignObj(trackers, trackerFilter, trackerAssign) : {},

      newState           = {
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
    return newState;
  };
}


/**
 * TracksList.componentDidMound() subscribes to updates from our Firebase
 * adaptor, which uses this mutator to alter state.
 * @param firebaseState to update
 * @returns new local state
 */
function getUpdateFromFirebaseAction(firebaseState) {

  return function({trackers, sessions}, props) {
    const

      newState                           = {
        trackers: {
          ...trackers,
          ...firebaseState.trackers,
        },
        sessions: {
          ...sessions,
          ...firebaseState.sessions,
        }
      };

    // console.log('getAdvanceTimeAction: after state:');
    // console.log(newState);
    return newState
  };
}


function getLogoutAction() {
  return function(state, props) {

    const newState = {
      trackers: {},
      sessions: {},
      loggedIn: false
    };

    return newState
  };
}


class Tracks extends Component {

  constructor(props) {
    super(props);

    this.onAddTrackClicked     = this.onAddTrackClicked.bind(this);
    this.onSaveTrack           = this.onSaveTrack.bind(this);
    this.onStartEditTrackId    = this.onStartEditTrackId.bind(this);
    this.onDeleteExistingTrack = this.onDeleteExistingTrack.bind(this);
    this.onPlayPause           = this.onPlayPause.bind(this);
    this.persistToDatabase     = this.persistToDatabase.bind(this);
    this.handleDatabaseUpdate  = this.handleDatabaseUpdate.bind(this);

    this.state = {
      trackers: {},
      sessions: {},
      loggedIn: false
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.onAdvanceTime(),
      1000
    );
    Firebase.subscribe(this);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    Firebase.unsubscribe(this);
  }

  /**
   * Our custom Firebase adaptor has subscribe() and unsubscribe()
   * methods called from componentDidMount() and componentWillMount().
   *
   * When subscribed, listeners' get notified of database updates
   * with this method.
   * @param firebaseState
   * @param firebaseUser
   */
  handleDatabaseUpdate(firebaseState = {}, firebaseUser) {
    if (firebaseUser) {
      console.log('caught TracksList.handleDatabaseUpdate WITH user',
        firebaseState, firebaseUser);
      this.setState(getUpdateFromFirebaseAction({...firebaseState}))
    } else {
      console.log('caught Tracks.onAuthStateChanged WITHOUT user');
      this.setState(getLogoutAction())
    }
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

    /**
     * Remove private properties starting with an underscore from
     * the state to persist to firebase. This is necessary so that
     * multiple devices don't get into a race condition when updating firebase.
     * @param state
     */
  persistToDatabase(state = this.state) {
    const
      {trackers = {}, sessions = {}} = state,
      noopFilter                     = (instance) => instance.id,
      localPropsCleaner              = (id, instance) => {
        const // eslint-disable-next-line
          {_elapsed, _sessionElapsed, cleanInstance} = instance;
        return {
          [id]: {
            ...instance,
          }

        }
      },
      cleanTrackers                  = trackers
        ? filterAndAssignObj(trackers, noopFilter, localPropsCleaner) : {},
      cleanSessions                  = sessions
        ? filterAndAssignObj(sessions, noopFilter, localPropsCleaner) : {}
    ;
    debugger;
    Firebase.set({
      trackers: cleanTrackers,
      sessions: cleanSessions
    });
  }

  onAdvanceTime() {
    this.setState(getAdvanceTimeAction())
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
          sessionDuration = session ? session._elapsed + session.finalDuration : 0,
          totalDuration   = tracker.completedSessionDuration + tracker._sessionElapsed
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
                                  totalDuration={totalDuration}
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
            <AddIcon/>
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