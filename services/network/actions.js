import Actions from '../../actions';

module.exports.connectionState = ({ status }) => ({
  type: Actions.CONNECTION_STATE,
  isConnected: status,
});

module.exports.removeFromQueue = ({ request }) => ({
  type: Actions.REMOVE_FROM_QUEUE,
  request,
});

module.exports.addToQueue = ({ request }) => ({
  type: Actions.ADD_TO_QUEUE,
  request,
});
