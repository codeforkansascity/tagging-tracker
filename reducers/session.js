import Actions from '../actions';

const initialState = {
  tokens: {
    access: {
      type: null,
      value: null,
      expiresIn: 'Right Now'
    },
    refresh: {
      type: null,
      value: null
    }
  },
  user: {
    id: null
  }
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.UPDATE:
      return {
        ...action.session,
      };
    default:
      return state;
  }
};

module.exports = sessionReducer;
