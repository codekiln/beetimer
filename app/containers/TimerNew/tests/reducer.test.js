
import { fromJS } from 'immutable';
import timerNewReducer from '../reducer';

describe('timerNewReducer', () => {
  it('returns the initial state', () => {
    expect(timerNewReducer(undefined, {})).toEqual(fromJS({}));
  });
});
