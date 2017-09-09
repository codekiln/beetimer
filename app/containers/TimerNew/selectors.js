import { createSelector } from 'reselect';

/**
 * Direct selector to the timerNew state domain
 */
const selectTimerNewDomain = () => (state) => state.get('timerNew');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TimerNew
 */

const makeSelectTimerNew = () => createSelector(
  selectTimerNewDomain(),
  (substate) => substate.toJS()
);

export default makeSelectTimerNew;
export {
  selectTimerNewDomain,
};
