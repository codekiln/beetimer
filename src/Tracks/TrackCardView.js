import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardActions, CardContent, CardHeader} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import {red} from 'material-ui/colors';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import ModeEditIcon from 'material-ui-icons/ModeEdit';

const styleSheet = theme => ({
  card:     {maxWidth: 400},
  flexGrow: {flex: '1 1 auto'},
  playIcon: {
    height: 38,
    width:  38,
    color:  red[500]
  },
  description: {
    margin: `0 0 ${theme.spacing.unit * 2}px 0`
  }
});


function renderTotalDuration(totalDuration) {
  let
    diff             = totalDuration,
    phraseComponents = [];

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  if (days) {
    phraseComponents.push(`${days} days`)
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  if (hours) {
    phraseComponents.push(`${hours} hours`)
  }

  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * (1000 * 60);

  if (mins) {
    phraseComponents.push(`${mins} mins`)
  }

  const seconds = Math.floor(diff / (1000));
  diff -= seconds * (1000);

  phraseComponents.push(`${seconds} seconds`);

  return phraseComponents.join(", ")
}


class TrackCardView extends Component {

  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
    this.onPlayPause  = this.onPlayPause.bind(this);
    this.onEdit       = this.onEdit.bind(this);

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

      {
        classes, name, description, sessionId,
        totalDuration, sessionDuration
      }                       = this.props,

      renderedSessionDuration = sessionDuration
        ? `Current Session: ${renderTotalDuration(sessionDuration)}` : '',

      renderedTotalDuration   = totalDuration
        ? `Total Time: ${renderTotalDuration(totalDuration)}` : '',

      cardPlayPause           = (
        <IconButton onClick={this.onPlayPause}>
          {
            sessionId ? (<PauseIcon/>) : (<PlayArrowIcon className={classes.playIcon}/>)
          }
        </IconButton>
      ),

      cardHeader              = (
        <CardHeader
          avatar={cardPlayPause}
          title={name}
          subheader={renderedSessionDuration}
        />
      ),

      cardBody                = renderedTotalDuration ? (
        <CardContent>
          {description
            ? (<Typography className={classes.description} component="p"> { description } </Typography>) : null}
          <Typography component="p"> { renderedTotalDuration } </Typography>
        </CardContent>
      ) : null,

      cardActions             = (
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
  classes:         PropTypes.object.isRequired,
  description:     PropTypes.string.isRequired,
  id:              PropTypes.string.isRequired,
  name:            PropTypes.string.isRequired,
  onEdit:          PropTypes.func.isRequired,
  onPlayPause:     PropTypes.func.isRequired,
  sessionId:       PropTypes.string.isRequired,
  totalDuration:   PropTypes.number.isRequired,
  sessionDuration: PropTypes.number.isRequired,
};

export default withStyles(styleSheet)(TrackCardView);