function getConfig() {
  if (__DEV__) {
    return {
      clientId: '8puWuJWZYls1Ylawxm6CMiYREhsGGSyw',
      url: 'http://localhost:1337',
    };
  } else {
    return {}
  }
}

module.exports = getConfig();
