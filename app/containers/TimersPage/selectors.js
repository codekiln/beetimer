import { createSelector } from 'reselect';

/**
 * Direct selector to the timersPage state domain
 */
const selectTimersPageDomain = () => (state) => state.get('timersPage');

/**
 * Other specific selectors
 */


/**
 * Default selector used by TimersPage
 */

const makeSelectTimersPage = () => createSelector(
  selectTimersPageDomain(),
  (substate) => substate.toJS()
);

export default makeSelectTimersPage;
export {
  selectTimersPageDomain,
};
