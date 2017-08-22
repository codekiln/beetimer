import React from "react";
import {withStyles} from "material-ui/styles";
import {Grid, Paper, Typography} from "material-ui";
import PropTypes from "prop-types";


const styleSheet = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    textAlign: "center"
  }),
  button: {
    margin: theme.spacing.unit,
  },
});


function TrackMessage({classes, title, body}) {

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

TrackMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};

export default withStyles(styleSheet)(TrackMessage);