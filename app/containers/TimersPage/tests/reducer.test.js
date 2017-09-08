
import { fromJS } from 'immutable';
import timersPageReducer from '../reducer';

describe('timersPageReducer', () => {
  it('returns the initial state', () => {
    expect(timersPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
