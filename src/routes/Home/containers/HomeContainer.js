import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Theme from 'theme'
import {dataToJS, firebaseConnect, isLoaded, pathToJS,} from 'react-redux-firebase'
import Snackbar from 'material-ui/Snackbar'
import classes from './HomeContainer.scss'

const populates = [{child: 'owner', root: 'users', keyProp: 'uid'}]

@firebaseConnect([
  // 'todos' // sync full list of todos
  // { path: 'todos', type: 'once' } // for loading once instead of binding
  // { path: 'todos', queryParams: ['orderByKey', 'limitToLast=5'] } // 10 most recent
  // { path: 'todos', populates } // populate
  // { path: 'todos', storeAs: 'myTodos' } // store elsewhere in redux
])
@connect(({firebase}) => ({
  auth:    pathToJS(firebase, 'auth'),
  account: pathToJS(firebase, 'profile'),
}))
export default class Home extends Component {
  static propTypes = {
    firebase: PropTypes.shape({
      set:      PropTypes.func.isRequired,
      remove:   PropTypes.func.isRequired,
      push:     PropTypes.func.isRequired,
      database: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
    }),
    auth:     PropTypes.shape({
      uid: PropTypes.string
    })
  }

  state = {
    error: null
  }

  render() {
    const {todos} = this.props
    const {error} = this.state

    return (
      <div
        className={classes.container}
        style={{color: Theme.palette.primary2Color}}
      >
        {error
          ? <Snackbar
            open={!!error}
            message={error}
            autoHideDuration={4000}
            onRequestClose={() => this.setState({error: null})}
          />
          : null}
      </div>
    )
  }
}
