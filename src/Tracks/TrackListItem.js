import React, {Component} from 'react';
import Firebase from '../Firebase'
import {createStyleSheet, withStyles} from "material-ui/styles";
import {Button, Grid, Paper, Typography} from "material-ui";
import PropTypes from "prop-types";
import AddIcon from 'material-ui-icons/Add';
// import ModeEditIcon from 'material-ui-icons/ModeEdit';


const styleSheet = createStyleSheet('TrackListItem', theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
  }),
  button: {
    margin: theme.spacing.unit,
  },
}));


function TrackListItem({classes, title, body}) {

  return (
    <Grid item xs={11}>
      <Paper className={classes.root} elevation={4}>
        <Typography type="headline" component="h3">
          {title}
        </Typography>
        <Typography type="body1" component="p">
          {body}
        </Typography>
      </Paper>
    </Grid>
  );
}

TrackListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(TrackListItem);