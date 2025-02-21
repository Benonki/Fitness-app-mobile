import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
  },
  imageContainer: {
      position: 'relative',
  },
  headerImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
  },
  title: {
      position: 'absolute',
      fontSize: 25,
      fontWeight: 'bold',
      color: 'white',
      padding: 20,
      textAlign: 'left',
  },
  infoContainer: {
      padding: 10,
      backgroundColor: '#f4f4f2',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
  },
  infoText: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
  },
  exerciseItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
},
  exerciseImage: {
      width: 140,
      height: 140,
      borderRadius: 10,
      marginRight: 10,
  },
  exerciseTextContainer: {
      flex: 1,
  },
  exerciseName: {
      fontSize: 18,
      fontWeight: 'bold',
  },
  exerciseReps: {
      fontSize: 14,
      color: '#555',
  },
  timeContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 90,
    left: 15,
  },
  caloriesContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 135,
    left: 15,
  },
  timeText: {
    fontSize: 22,
    color: 'white',
  },
  caloriesText: {
    fontSize: 22,
    color: 'white',
  },
});


export default styles;