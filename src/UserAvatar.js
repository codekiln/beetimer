import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
// import FaceIcon from 'material-ui-icons/Face';
import { grey } from 'material-ui/colors';

const styleSheet = theme => ({
  chip: {
    margin: theme.spacing.unit,
  },
  svgIcon: {
    color: grey[800],
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});


function UserAvatar(props) {

  const classes = props.classes;

  return (
    <Chip
      avatar={<Avatar src={props.imageUrl} />}
      label={props.displayName}
      onRequestDelete={props.onLogout}
      className={classes.chip}
    />
  )
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired
};

export default withStyles(styleSheet)(UserAvatar);