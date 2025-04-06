import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../UserContext';
import { loadProductsFromAPI, updateUserProducts, clearUserProducts } from '../../api/eatedProducts';

const DATE_STORAGE_KEY = '@lastDate';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [lastDate, setLastDate] = useState(null);

  const loadProducts = async () => {
    if (!user) return;

    try {
      const storedDate = await AsyncStorage.getItem(DATE_STORAGE_KEY);
      const today = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      const userData = await loadProductsFromAPI(user.id);

      if (!storedDate || storedDate !== today) {
        await updateUserProducts(user.id, []);

        await Promise.all([
          AsyncStorage.setItem(DATE_STORAGE_KEY, today),
          AsyncStorage.setItem(`birthdayNotificationSent_${user.id}`, 'false'),
          AsyncStorage.setItem(`stepGoalReached_${user.id}`, 'false'),
          AsyncStorage.setItem(`caloriesGoalReached_${user.id}`, 'false'),
        ]);
        userData.eatenProducts = [];
      }
      setLastDate(today);
      setProducts(userData.eatenProducts || []);
    } catch (error) {
      console.error('Błąd podczas ładowania produktów:', error);
    }
  };

  const addProduct = async (product) => {
    if (!user) return;
    if (!product || product.calories === 0) {
      console.error('Produkt ma nieprawidłowe lub puste dane');
      return;
    }

    const productWithDefaults = {
      name: product.name || '',
      calories: product.calories || 0,
      fat: product.fat || 0,
      sugar: product.sugar || 0,
      proteins: product.proteins || 0,
    };
    try {
      const userData = await loadProductsFromAPI(user.id);
      const updatedProducts = userData.eatenProducts
          ? [...userData.eatenProducts, productWithDefaults]
          : [productWithDefaults];
      await updateUserProducts(user.id, updatedProducts);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Błąd podczas dodawania produktu:', error);
    }
  };


  const removeProduct = async (productIndex) => {
    if (!user) return;

    try {
      const userData = await loadProductsFromAPI(user.id);
      const updatedProducts = userData.eatenProducts.filter((_, index) => index !== productIndex);
      await updateUserProducts(user.id, updatedProducts);
      setProducts(updatedProducts);
    } catch (error) {
      console.error('Błąd podczas usuwania produktu:', error);
    }
  };

  const clearProducts = async () => {
    if (!user) return;

    try {
      await clearUserProducts(user.id);
      setProducts([]);
    } catch (error) {
      console.error('Błąd podczas czyszczenia produktów:', error);
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
  }, [user]);

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