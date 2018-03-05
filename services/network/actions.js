import Actions from '../../actions';

module.exports.connectionState = ({ isConnected }) => ({
  type: Actions.CONNECTION_STATE,
  isConnected,
});
