import * as types from '../constants/ActionTypes'

export const addTrack = text => ({ type: types.ADD_TRACK, text })
export const deleteTrack = id => ({ type: types.DELETE_TRACK, id })
export const editTrack = (id, text) => ({ type: types.EDIT_TRACK, id, text })
export const finishTrack = id => ({ type: types.FINISH_TRACK, id })
export const clearAll = () => ({ type: types.CLEAR_ALL })
export const startTrack = () => ({ type: types.START_TRACK })
