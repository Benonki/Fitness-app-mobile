import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginBottom: 10,
    paddingLeft: 10,
  },
  allInputs: {
    alignItems: "center"
  },
  checkboxContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxText: {
    marginLeft: 8,
  },
  button: {
    marginTop: 15,
    marginBottom: 35,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#11D9EF',
    alignItems: 'center',

  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  blueText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  pickerWrapper: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  pickerInput: {
    width: '100%',
    height: 35,
    paddingBottom: 20,
    marginBottom: 20,
  },
});

export default styles;
