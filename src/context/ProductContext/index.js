import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ProductContext = createContext();

const PRODUCT_STORAGE_KEY = '@products';
const DATE_STORAGE_KEY = '@lastDate';

export const ProductProvider = ({ children }) => {
  const [ products, setProducts ] = useState([]);
  const [ lastDate, setLastDate ] = useState(null);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCT_STORAGE_KEY);
      const storedDate = await AsyncStorage.getItem(DATE_STORAGE_KEY);

      const today = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      if (storedDate && storedDate === today) {
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } else {
		await clearProducts();
		await Promise.all([
        AsyncStorage.setItem('birthdayNotificationSent', 'false'),
        AsyncStorage.setItem('stepGoalReached', 'false'),
        AsyncStorage.setItem('caloriesGoalReached', 'false')
    ]);
}

      setLastDate(today);
      await AsyncStorage.setItem(DATE_STORAGE_KEY, today);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveProducts = async (updatedProducts) => {
    try {
      await AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const addProduct = (product) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, product];
      saveProducts(updatedProducts);
      return updatedProducts;
    });
  };

  const removeProduct = (index) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.filter((_, i) => i !== index);
      saveProducts(updatedProducts);
      return updatedProducts;
    });
  };

  const clearProducts = async () => {
    try {
      await AsyncStorage.removeItem(PRODUCT_STORAGE_KEY);
      setProducts([]);
    } catch (error) {
      console.error('Error clearing products:', error);
    }
  };

  const getTotalNutrients = () => {
    return products.reduce(
        (totals, product) => {
          return {
            calories: totals.calories + (parseFloat(product.calories) || 0),
            fat: totals.fat + (parseFloat(product.fat) || 0),
            sugar: totals.sugar + (parseFloat(product.sugar) || 0),
            proteins: totals.proteins + (parseFloat(product.proteins) || 0),
          };
        },
        { calories: 0, fat: 0, sugar: 0, proteins: 0 }
    );
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
      <ProductContext.Provider
          value={{
            products,
            addProduct,
            removeProduct,
            clearProducts,
            getTotalNutrients,
            lastDate,
          }}
      >
        {children}
      </ProductContext.Provider>
  );
};

export const useProducts = () => {
  return useContext(ProductContext);
};
