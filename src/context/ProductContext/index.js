import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import { loadProductsFromAPI, updateUserProducts } from '../../api/eatedProducts';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [lastDate, setLastDate] = useState(null);

  const loadProducts = async () => {
    if (!user) return;

    try {
      const today = new Date().toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      setLastDate(today);
      const userData = await loadProductsFromAPI(user.id);
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