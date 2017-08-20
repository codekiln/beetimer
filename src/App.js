import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainLayout from './MainLayout';
import TopBar from "./TopBar";
import Firebase from './Firebase'
import Button from 'material-ui/Button';
import UserAvatar from './UserAvatar'
import Tracks from "./Tracks/TracksList";

export default class App extends Component {

  constructor(props) {
    super(props);

    this.handleLoginClicked      = this.handleLoginClicked.bind(this);
    this.handleLoginDialogOpened = this.handleLoginDialogOpened.bind(this);
    this.handleLoginDialogClosed = this.handleLoginDialogClosed.bind(this);
    this.handleDatabaseUpdate    = this.handleDatabaseUpdate.bind(this);
    this.handleLogoutClicked     = this.handleLogoutClicked.bind(this);

    this.state = {
      loginDialogOpen:   false,
      userName:          '',
      userProfilePicUrl: ''
    };
  }

  componentDidMount() {
    Firebase.subscribe(this);
  }

  componentWillUnmount() {
    Firebase.unsubscribe(this);
  }

  /**
   * Our custom Firebase adaptor has subscribe() and unsubscribe()
   * methods called from componentDidMount() and componentWillMount().
   *
   * When subscribed, listeners' get notified of database updates
   * with this method.
   * @param firebaseState
   * @param firebaseUser
   */
  handleDatabaseUpdate(firebaseState, firebaseUser) {
    console.log('caught App.handleDatabaseUpdate', firebaseState, firebaseUser);
    if (firebaseUser) {
      this.setState({
        userName:          firebaseUser.displayName,
        userProfilePicUrl: firebaseUser.photoURL
      });
    } else {
      this.setState({
        userName:          '',
        userProfilePicUrl: ''
      });
    }
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

  handleLogoutClicked() {
    console.log('caught sign out in App.js');
    Firebase.auth.signOut();
    this.setState({
      userName:          '',
      userProfilePicUrl: ''
    });
  }

  render() {
    const loginZone = this.state.userName ?
      <UserAvatar displayName={this.state.userName}
                  imageUrl={this.state.userProfilePicUrl}
                  onLogout={this.handleLogoutClicked}/> :
      <Button contrast onClick={this.handleLoginClicked}>Login</Button>;

    return (
      <MuiThemeProvider>
        <MainLayout
          header={
            <TopBar>
              {loginZone}
            </TopBar>
          }>
          <Tracks/>
        </MainLayout>
      </MuiThemeProvider>
    );
  }
}