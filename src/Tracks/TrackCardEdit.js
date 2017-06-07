import React, {Component} from "react";
import PropTypes from "prop-types";
import {createStyleSheet, withStyles} from "material-ui/styles";
import Card, {CardActions, CardContent} from "material-ui/Card";
import IconButton from "material-ui/IconButton";
// import {red} from "material-ui/styles/colors";
import DoneIcon from "material-ui-icons/Done";
import DeleteIcon from "material-ui-icons/Delete";
import {TextField} from "material-ui";


const styleSheet = createStyleSheet('TrackCardEdit', theme => ({
  card: {
    // margin: theme.spacing.unit,
    maxWidth: 400
  },
  doneIcon: {
    // height: 38,
    // width: 38,
    // color: red[500]
  },
  input: {
    // margin: theme.spacing.unit,
    // width: 200
  },
  descriptionInput: {
    // margin: theme.spacing.unit,
    // width: 200
  }
}));


class TrackCardEdit extends Component {

  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = props.tracker;
  }

  handleNameChange(event) {
    this.setState({name: event.target.value});
  }

  handleDescriptionChange(event) {
    this.setState({description: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('Card updated and submitted: ');
    this.props.onSave(this.state);
  }

  render() {
    const
      {classes} = this.props,
      {name, description} = this.state,
      nameEdit = (
        <TextField required label="Name" className={classes.input} value={name}
                   type="text" onChange={this.handleNameChange}
          // InputProps={{ placeholder: 'Time Tracker Name' }}
        />),
      descriptionEdit = (
        <TextField label="Description" className={classes.input} value={description}
                   multiline rowsMax="4" onChange={this.handleDescriptionChange}
          // InputProps={{ placeholder: 'Time Tracker Description' }}
        />)
    ;

    return (
      <form onSubmit={this.handleSubmit}>
        <Card className={classes.card}>
          <CardContent>
            {nameEdit}
            {descriptionEdit}
          </CardContent>
          <CardActions >
            <IconButton type="submit" label="Save">
              <DoneIcon className={classes.doneIcon}/>
            </IconButton>
            <IconButton label="Cancel">
              <DeleteIcon />
            </IconButton>
          </CardActions>
        </Card>
      </form>
    );
  }
}

TrackCardEdit.propTypes = {
  classes: PropTypes.object.isRequired,
  tracker: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default withStyles(styleSheet)(TrackCardEdit);