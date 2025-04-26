import React, { useState, useEffect, useContext } from 'react';
import { Text, View, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView } from 'expo-camera';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './StyleSheet.js';
import { UserContext } from '../../context/UserContext';
import { Audio } from 'expo-av';
import { fetchSearchResultsFromAPI, fetchDietProductsFromAPI, fetchProductDataFromAPI } from '../../api/products';

const WyszukiwarkaScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [ searchText, setSearchText ] = useState('');
  const [ searchResults, setSearchResults ] = useState([]);
  const [ debouncedSearch, setDebouncedSearch ] = useState('');
  const [ typeOfDiet, setTypeOfDiet ] = useState('');
  const [ dietProducts, setDietProducts ] = useState([]);
  const [ cameraVisible, setCameraVisible ] = useState(false);
  const [ scanned, setScanned ] = useState(false);
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (user) {
      setTypeOfDiet(user.cel);
    }
  }, [user]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetchSearchResults(debouncedSearch);
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (typeOfDiet) {
      fetchDietProducts();
    }
  }, [typeOfDiet]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      const products = await fetchSearchResultsFromAPI(query);
      setSearchResults(products);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDietProducts = async () => {
    setLoading(true);
    try {
      const products = await fetchDietProductsFromAPI(typeOfDiet);
      setDietProducts(products);
    } catch (error) {
      console.error('Error fetching diet products:', error);
      setDietProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeScanned = async ({ data }) => {
    setScanned(true);
    try {
      const { sound } = await Audio.Sound.createAsync(
          require('../../../assets/beep.mp3')
      );
      await sound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
    fetchProductData(data);
  };

  const fetchProductData = async (barcode) => {
    try {
      const product = await fetchProductDataFromAPI(barcode);
      if (product) {
        navigateToProductDetails(product);
      } else {
        alert('No product found');
      }
    } catch (error) {
      alert('Error fetching product details');
    } finally {
      setScanned(false);
    }
  };

  const navigateToProductDetails = (product) => {
    navigation.navigate('Informacje o Produkcie', {
      productDetails: {
        name: product.product_name || 'N/A',
        nutriScore: product.nutrition_grades_tags || 'N/A',
        calories: product.nutriments['energy-kcal_100g'] || 'N/A',
        fat: product.nutriments['fat_100g'] || 'N/A',
        sugar: product.nutriments['sugars_100g'] || 'N/A',
        proteins: product.nutriments['proteins_100g'] || 'N/A',
        image_url: product.image_url || null,
      },
    });
    setCameraVisible(false);
  };

  const renderProductItem = ({ item }) => (
      <TouchableOpacity
          style={styles.productItem}
          onPress={() => navigateToProductDetails(item)}
      >
        <Text style={styles.productName}>{item.product_name || 'No name'}</Text>
      </TouchableOpacity>
  );

  const renderDietProductItem = ({ item }) => {
    if (!item.product_name) {
      return null;
    }
    return (
        <TouchableOpacity
            style={styles.dietProductItem}
            onPress={() => navigateToProductDetails(item)}
        >
          <Text style={styles.productName}>{item.product_name || 'No name'}</Text>
          {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.productImage} resizeMode="cover" />
          ) : (
              <Text style={styles.noImageText}>No image available</Text>
          )}
          <Text style={styles.productCalories}>
            {item.nutriments['energy-kcal_100g']
                ? `${item.nutriments['energy-kcal_100g']} kcal / 100g`
                : 'Calories not available'}
          </Text>
          {typeOfDiet === 'Keto' && (
              <Text style={styles.productFat}>
                {item.nutriments['fat_100g']
                    ? `${item.nutriments['fat_100g']}g tłuszczu / 100g`
                    : 'Fat not available'}
              </Text>
          )}
        </TouchableOpacity>
    );
  };

  return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <TextInput
              style={styles.searchBar}
              placeholder="Wyszukaj produkt"
              value={searchText}
              onChangeText={setSearchText}
          />
          <Icon name="search-outline" size={30} color="black" style={styles.searchIcon} />
          <Icon
              name="camera-outline"
              size={30}
              color="black"
              style={styles.cameraIcon}
              onPress={() => setCameraVisible(true)}
          />
        </View>
        {searchText.trim() === '' && !cameraVisible && (
            <View style={styles.ProposalItems}>
              <Text style={styles.dietTitle}>Propozycje dla celu: {typeOfDiet}</Text>

              {loading ? (
                  <ActivityIndicator size="large" color="#11D9EF" />
              ) : (
                  typeOfDiet && dietProducts.length > 0 ? (
                      <FlatList
                          data={dietProducts}
                          keyExtractor={(item, index) => item.id || item.code || index.toString()}
                          renderItem={renderDietProductItem}
                          ListEmptyComponent={<Text style={styles.noResultsText}>No products found</Text>}
                          showsHorizontalScrollIndicator={false}
                      />
                  ) : (
                      <Text style={styles.noResultsText}>No products found</Text>
                  )
              )}
            </View>
        )}

        {!cameraVisible && (
            <View style={styles.searchResultsContainer}>
              {loading && searchText.trim() ? (
                  <ActivityIndicator size={100} color="#11D9EF" />
              ) : (
                  <FlatList
                      data={searchResults}
                      keyExtractor={(item, index) => item.id || item.code || index.toString()}
                      renderItem={renderProductItem}
                      ListEmptyComponent={
                        !searchText.trim() ? null : <Text style={styles.noResultsText}>No products found</Text>
                      }
                  />
              )}
            </View>
        )}

        {cameraVisible && (
            <CameraView onBarcodeScanned={scanned ? undefined : handleBarcodeScanned} style={styles.cameraView}>
              <View style={styles.cameraOverlay}>
                <Icon
                    name="scan-outline"
                    size={300}
                    color="white"
                    onPress={() => setCameraVisible(false)}
                    style={[styles.cameraScanOverlay]}
                />
                <Icon
                    name="close"
                    size={40}
                    color="white"
                    onPress={() => setCameraVisible(false)}
                    style={styles.cameraCloseButton}
                />
              </View>
            </CameraView>
        )}
      </View>
  );
};

export default WyszukiwarkaScreen;