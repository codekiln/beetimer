import React from "react";
import PropTypes from "prop-types";
import {createStyleSheet, withStyles} from "material-ui/styles";
import Grid from "material-ui/Grid";


const styleSheet = createStyleSheet('FullWidthGrid', theme => ({
  root: {
    flexGrow: 1,
    marginTop: 30,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
  },
}));


function FullWidthGrid({classes, header, children}) {

  return (
    <div className={classes.root}>
      <Grid container gutter={24}>
        <Grid item xs={12}>
          {header}
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </div>
  );
}


FullWidthGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  header: PropTypes.object.isRequired
};


export default withStyles(styleSheet)(FullWidthGrid);