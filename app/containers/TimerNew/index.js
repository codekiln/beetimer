/*
 *
 * TimerNew
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import makeSelectTimerNew from './selectors';
import messages from './messages';

export class TimerNew extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div>
        <Helmet
          title="TimerNew"
          meta={[
            { name: 'description', content: 'Description of TimerNew' },
          ]}
        />
        <FormattedMessage {...messages.header} />
      </div>
    );
  }
}

TimerNew.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  TimerNew: makeSelectTimerNew(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TimerNew);
