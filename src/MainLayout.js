import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyleSheet } from 'material-ui/styles';
// import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import TopBar from './TopBar'

const styleSheet = createStyleSheet('FullWidthGrid', theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function FullWidthGrid(props) {
  const classes = props.classes;

  return (
    <div className={classes.root}>
      <Grid container gutter={24}>
        <Grid item xs={12}>
          <TopBar/>
        </Grid>
      </Grid>
    </div>
  );
}

FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styleSheet)(FullWidthGrid);