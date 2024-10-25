import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import axios from 'axios';

const WyszukiwarkaScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarcodeScanned = ({ type, data }) => {
    setScanned(true);
    fetchProductData(data);
  };

  const fetchProductData = async (barcode) => {
    try {
      const response = await axios.get(`https://world.openfoodfacts.net/api/v2/product/${barcode}`);
      if (response.data && response.data.product) {
        const product = response.data.product;
        const nutriScore = product.nutrition_grades_tags ? product.nutrition_grades_tags[0] : 'N/A';
        const calories = product.nutriments ? product.nutriments['energy-kcal_100g'] : 'N/A';
        const fat = product.nutriments ? product.nutriments['fat_100g'] : 'N/A';
        const sugar = product.nutriments ? product.nutriments['sugars_100g'] : 'N/A';
        const proteins = product.nutriments ? product.nutriments['proteins_100g'] : 'N/A';

        Alert.alert(
          'Szczegóły produktu',
          `Nazwa: ${product.product_name}\nNutri-Score: ${nutriScore}\nWartość energetyczna: ${calories} kcal/100g\nTłuszcz: ${fat} g/100g\nCukry: ${sugar} g/100g\nBiałko: ${proteins} g/100g`
        );
      } else {
        Alert.alert('Nie znaleziono produktu');
      }
    } catch (error) {
      Alert.alert('Wystąpił błąd podczas pobierania szczegółów produktu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Zeskanuj kod produktu</Text>
      {!scanned && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: ['ean13', 'qr', 'pdf417', 'ean8'],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {scanned && <Button title={'Kliknij tutaj'} onPress={() => setScanned(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default WyszukiwarkaScreen;
