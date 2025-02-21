import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
    textDesign: {
        backgroundColor: '#11D9EF',
        textAlign: 'center',
        height: 40,
        width: 350,
        borderWidth: 1,
        overflow: "hidden",
        fontSize: 25,
        fontWeight: "bold",
        marginTop: 15,
    },
    CircularProgressArea: {
        flex : 1.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    BorderOut: {
        borderWidth: 4,
        borderColor: '#000',
        borderRadius: 195,
    },
    BorderIns: {
        position: 'absolute',
        top: 33,
        left: 33,
        right: 33,
        bottom: 33,
        borderWidth: 4,
        borderColor: '#000',
        borderRadius: 190,
    },
    buttonContainer: {
        backgroundColor: '#11D9EF',
        paddingVertical: 8,
        paddingHorizontal: 15,
        alignItems: 'center',
        marginHorizontal: 16,
        marginVertical: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        borderWidth: 1,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default styles;