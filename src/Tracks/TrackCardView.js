import React, {Component} from "react";
import PropTypes from "prop-types";
import {createStyleSheet, withStyles} from "material-ui/styles";
import Card, {CardActions, CardContent, CardHeader} from "material-ui/Card";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import {red} from "material-ui/styles/colors";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import PauseIcon from "material-ui-icons/Pause";
import DeleteIcon from "material-ui-icons/Delete";

const styleSheet = createStyleSheet('TrackCardView', theme => ({
  card: {maxWidth: 400},
  avatar: {
    // backgroundColor: red[500]
  },
  flexGrow: {flex: '1 1 auto'},
  playIcon: {
    height: 38,
    width: 38,
    color: red[500]
  }
}));


class TrackCardView extends Component {

  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.onPlayPause = this.onPlayPause.bind(this);

  }

  handleDelete(event) {
    event.preventDefault();
    console.log('Existing Tracker delete initiated');
    this.props.onDelete(this.props.id);
  }

  onPlayPause(event) {
    event.preventDefault();
    console.log('Existing Tracker play or pause initiated');
    this.props.onPlayPause(this.props.id);
  }

  render() {
    const
      {classes, name, description, playing} = this.props,

      acronym = name
        .split(/\s/)
        .reduce(function (accumulator, word) {
          return accumulator + word.charAt(0).toUpperCase();
        }, ''),

      cardHeader = (
        <CardHeader
          avatar={<Avatar aria-label="Time Tracker" className={classes.avatar}>{acronym}</Avatar>}
          title={name}
        />
      ),

      cardBody = description ? (
        <CardContent>
          <Typography component="p"> { description } </Typography>
        </CardContent>
      ) : null,

      cardPlayPause = (
        <IconButton onClick={this.onPlayPause}>
          {
            playing ? (<PauseIcon/>) : (<PlayArrowIcon className={classes.playIcon}/>)
          }
        </IconButton>
      ),

      cardActions = (
        <CardActions disableActionSpacing>
          {cardPlayPause}
          <div className={classes.flexGrow}/>
          <IconButton label="Delete" onClick={this.handleDelete}>
            <DeleteIcon />
          </IconButton>
        </CardActions>
      );

    return (
      <Card className={classes.card}>
        {cardHeader}
        {cardBody}
        {cardActions}
      </Card>
    );
  }
}

TrackCardView.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  playing: PropTypes.bool.isRequired,
};

export default withStyles(styleSheet)(TrackCardView);