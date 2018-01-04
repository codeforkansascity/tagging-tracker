import { NetInfo, Platform } from 'react-native';

export const getNetworkConnectionStatus = () => {
  if (Platform.OS === 'ios') {
    return new Promise(resolve => {
      const handleFirstConnectivityChangeIOS = isConnected => {
        NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChangeIOS);
        resolve(isConnected);
      };
      NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChangeIOS);
    });
  }

  return NetInfo.isConnected.fetch();
}
