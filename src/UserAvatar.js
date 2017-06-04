import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import FaceIcon from 'material-ui-icons/Face';
import { grey } from 'material-ui/styles/colors';

const styleSheet = createStyleSheet('UserAvatar', theme => ({
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
}));

function handleRequestDelete() {
  alert('You clicked the delete icon.'); // eslint-disable-line no-alert
}

function handleClick() {
  alert('You clicked the Chip.'); // eslint-disable-line no-alert
}

function UserAvatar(props) {
  const classes = props.classes;
  return (
    <Chip
      avatar={<Avatar src={props.imageUrl} />}
      label={props.displayName}
      onRequestDelete={handleRequestDelete}
      className={classes.chip}
    />
  )
  // return (
  //   <div className={classes.row}>
  //     <Chip label="Basic Chip" className={classes.chip} />
  //     <Chip
  //       avatar={<Avatar>MB</Avatar>}
  //       label={props.displayName}
  //       onClick={handleClick}
  //       className={classes.chip}
  //     />
  //     <Chip
  //       avatar={<Avatar src={props.imageUrl} />}
  //       label={props.displayName}
  //       onRequestDelete={handleRequestDelete}
  //       className={classes.chip}
  //     />
  //     <Chip
  //       avatar={<Avatar><FaceIcon className={classes.svgIcon} /></Avatar>}
  //       label={props.displayName}
  //       onClick={handleClick}
  //       onRequestDelete={handleRequestDelete}
  //       className={classes.chip}
  //     />
  //   </div>
  // );
}

UserAvatar.propTypes = {
  classes: PropTypes.object.isRequired,
  displayName: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(UserAvatar);