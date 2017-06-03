import React, {PureComponent} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainLayout from './MainLayout';

export default class App extends PureComponent {

  render() {
    return (
      <MuiThemeProvider>
        <MainLayout />
      </MuiThemeProvider>
    );
  }
}