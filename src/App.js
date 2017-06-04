import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainLayout from './MainLayout';
import TopBar from "./TopBar";
import Firebase from './Firebase'
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.handleLoginClicked = this.handleLoginClicked.bind(this);
    this.handleLoginDialogOpened = this.handleLoginDialogOpened.bind(this);
    this.handleLoginDialogClosed = this.handleLoginDialogClosed.bind(this);

    Firebase.setOnAuthStateChanged(this.onAuthStateChanged.bind(this));

    this.state = {
      loginDialogOpen: false,
      userName: '',
      userProfilePicUrl: ''
    };
  }

  componentDidMount() {

  }

  onAuthStateChanged(user) {
    if (user) {
      this.setState({
        userName: user.displayName,
        userProfilePicUrl: user.photoURL
      });
    } else {
      this.setState({
        userName: '',
        userProfilePicUrl: ''
      });
    }
    console.log('caught App.onAuthStateChanged');
    console.log(this.state);
  }

  handleLoginDialogOpened() {
    this.setState({
      loginDialogOpen: true,
    });
    console.log('caught handleLoginDialogOpened');
    console.log(this.state);
  }

  handleLoginDialogClosed() {
    this.setState({
      loginDialogOpen: false,
    });
    console.log('caught handleLoginDialogClosed');
    console.log(this.state);
  }

  handleLoginClicked() {
    console.log('caught handleLoginClicked');
    this.handleLoginDialogOpened();
    Firebase.signIn().then(this.handleLoginDialogClosed.bind(this));
  }

  render() {
    const loginArea = this.state.userName ?
      <Typography type="title" colorInherit>{this.state.userName}</Typography> :
      <Button contrast onClick={this.handleLoginClicked}>Login</Button>;

    const topBar = (
      <TopBar loginArea={loginArea}/>
    );

    return (
      <MuiThemeProvider>
        <MainLayout header={topBar}/>
      </MuiThemeProvider>
    );
  }
}