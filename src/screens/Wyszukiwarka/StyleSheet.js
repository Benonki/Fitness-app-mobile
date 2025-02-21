import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  searchIcon: {
    marginLeft: 10,
  },
  cameraIcon: {
    marginLeft: 10,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  cameraCloseButton: {
    padding: 10,
    borderRadius: 20,
  },
  cameraScanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productName: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#aaa',
  },
  ProposalItems: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  dietProductItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    maxWidth: 200,
    marginBottom: 16,
    elevation: 4,
  },
  productImage: {
    width: 80,
    height: 100,
    marginBottom: 8,
    borderRadius: 10,
  },
  productCalories: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  noImageText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
  },
  dietTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 12,
  },
  cameraView: StyleSheet.absoluteFillObject
});

export default styles;
