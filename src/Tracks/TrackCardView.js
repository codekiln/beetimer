import React, {Component} from "react";
import PropTypes from "prop-types";
import {createStyleSheet, withStyles} from "material-ui/styles";
import Card, {CardActions, CardContent, CardHeader} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import {red} from "material-ui/styles/colors";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import PauseIcon from "material-ui-icons/Pause";
import ModeEditIcon from 'material-ui-icons/ModeEdit';

const styleSheet = createStyleSheet('TrackCardView', theme => ({
  card: {maxWidth: 400},
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
    this.onEdit = this.onEdit.bind(this);

  }

  handleDelete(event) {
    event.preventDefault();
    console.log('Existing Tracker delete initiated');
    this.props.onDelete(this.props.id);
  }

  onEdit(event) {
    event.preventDefault();
    console.log('Existing Tracker edit initiated');
    this.props.onEdit(this.props.id);
  }

  onPlayPause(event) {
    event.preventDefault();
    console.log('Existing Tracker play or pause initiated');
    this.props.onPlayPause(this.props.id);
  }

  render() {
    const
      {classes, name, description, playing} = this.props,

      cardPlayPause = (
        <IconButton onClick={this.onPlayPause}>
          {
            playing ? (<PauseIcon/>) : (<PlayArrowIcon className={classes.playIcon}/>)
          }
        </IconButton>
      ),

      cardHeader = (
        <CardHeader
          avatar={cardPlayPause}
          title={name}
        />
      ),

      cardBody = description ? (
        <CardContent>
          <Typography component="p"> { description } </Typography>
        </CardContent>
      ) : null,

      cardActions = (
        <CardActions disableActionSpacing>
          <div className={classes.flexGrow}/>
          <IconButton label="Edit" onClick={this.onEdit}>
            <ModeEditIcon />
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
  description: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  playing: PropTypes.bool.isRequired,
};

export default withStyles(styleSheet)(TrackCardView);