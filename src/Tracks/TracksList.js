import React, {Component} from "react";
import Firebase from "../Firebase";
import {createStyleSheet, withStyles} from "material-ui/styles";
import {Button, Grid} from "material-ui";
import PropTypes from "prop-types";
import AddIcon from "material-ui-icons/Add";
import TrackMessage from "./TrackMessage";
import TrackCardView from "./TrackCardView";
import TrackCardEdit from "./TrackCardEdit";
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

    this.setState({
      tracks: this.state.tracks.concat([{
        key: this.state.tracks.length + 1,
        name: '',
        description: '',
        editing: true
      }])
    });
    console.log('caught Tracks.onAddTrackClicked');
    console.log(this.state);
  }

  render() {
    const classes = this.props.classes;
    const tracks = this.state.tracks.length > 0 ?
      this.state.tracks.map(function (tracker) {
        if (tracker.editing) {
          return (
            <TrackCardEdit key={tracker.key} name={tracker.name} description={tracker.description}
                           editing={tracker.editing}/>
          )
        }
        return (
          <TrackCardView key={tracker.key} name={tracker.name} description={tracker.description}/>
        );
      }) : (
        <TrackMessage title="No time trackers found!" body="Click the button below to create one."/>
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