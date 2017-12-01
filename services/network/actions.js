import Actions from '../../actions';

module.exports.connectionState = ({ status }) => ({
  type: Actions.CONNECTION_STATE,
  isConnected: status,
});
