import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pictureContainer: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
  },
  textInput: {
    width: '100%',
    marginBottom: 20,
  },
  codeEnforcementFlagsContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  workflowButtonsContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-end',
  },
  workFlowButtonsWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  workflowButton: {
    marginRight: 10,
  },
});
