import React, {Component} from "react";
import PropTypes from "prop-types";
import {createStyleSheet, withStyles} from "material-ui/styles";
import Card, {CardActions, CardContent, CardHeader, CardMedia} from "material-ui/Card";
import Avatar from "material-ui/Avatar";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import {red} from "material-ui/styles/colors";
import PlayArrowIcon from "material-ui-icons/PlayArrow";
import DeleteIcon from "material-ui-icons/Delete";

const styleSheet = createStyleSheet('TrackCardView', theme => ({
  card: {maxWidth: 400},
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // backgroundColor: red[500]
  },
  flexGrow: {flex: '1 1 auto'},
  playIcon: {
    height: 38,
    width: 38,
    color: red[500]
  },
  input: {
    margin: theme.spacing.unit,
  },
}));


class TrackCardView extends Component {
  // state = {
  //   expanded: false,
  // };
  //
  // handleExpandClick = () => {
  //   this.setState({expanded: !this.state.expanded});
  // };

  constructor(props) {
    super(props);

    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete(event) {
    event.preventDefault();
    console.log('Existing Tracker delete initiated');
    this.props.onDelete(this.props.id);
  }

  render() {
    const
      {classes, name, description} = this.props,
      acronym = name
        .split(/\s/)
        .reduce(function (accumulator, word) {
          return accumulator + word.charAt(0).toUpperCase();
        }, '');

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={<Avatar aria-label="Time Tracker" className={classes.avatar}>{acronym}</Avatar>}
          title={name}
          // subheader="September 14, 2016"
        />
        <CardMedia>
          {/*<img src={paellaImage} alt="Contemplative Reptile" />*/}
        </CardMedia>
        <CardContent>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
        <CardActions disableActionSpacing>
          <IconButton>
            <PlayArrowIcon className={classes.playIcon}/>
          </IconButton>
          <div className={classes.flexGrow}/>
          <IconButton label="Delete" onClick={this.handleDelete}>
            <DeleteIcon />
          </IconButton>
          {/*<IconButton*/}
          {/*className={classnames(classes.expand, {*/}
          {/*[classes.expandOpen]: this.state.expanded,*/}
          {/*})}*/}
          {/*onClick={this.handleExpandClick}*/}
          {/*>*/}
          {/*<ExpandMoreIcon />*/}
          {/*</IconButton>*/}
        </CardActions>
        {/*<Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>*/}
        {/*<CardContent>*/}
        {/*<Typography paragraph type="body2">History:</Typography>*/}
        {/*</CardContent>*/}
        {/*</Collapse>*/}
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
};

export default withStyles(styleSheet)(TrackCardView);