import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  formGroup: {
    marginLeft: 10,
    marginBottom: 10,
  },
  inputCele: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  inputInfo: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  bmiContainer: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  button: {
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 35,
    backgroundColor: '#11D9EF',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerWrapperCele: {
    width: '75%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  pickerWrapperInfo: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  pickerInput: {
    width: '100%',
    height: 'auto',
  },
  inputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    marginLeft: 10,
  },
  inputWrapper: {
    flex: 1,
    paddingRight: 10,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius:2,
  },
touchable:{
    width: 120,
    height: 120,
    borderWidth:2,
    borderStyle:'solid',
    borderColor:'#00000',
    borderRadius:5,
    position: 'absolute',
    top:-50,
    left:220,
},
});

export default styles;
