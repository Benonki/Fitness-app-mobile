import axios from 'axios';

export const fetchSearchResultsFromAPI = async (query) => {
    try {
        const response = await axios.get(
            `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`
        );
        return response.data.products || [];
    } catch (error) {
        console.error('Error fetching search results:', error);
        return [];
    }
};

export const fetchDietProductsFromAPI = async (typeOfDiet) => {
    try {
        const response = await axios.get(
            `https://world.openfoodfacts.org/cgi/search.pl?search_simple=1&action=process&json=1`
        );

        if (response.data && Array.isArray(response.data.products)) {
            const products = response.data.products.filter((product) => {
                if (!product.nutriments) return false;

                if (typeOfDiet === 'Utrata wagi') {
                    if (product.product_name && (product.product_name.includes('Coca-Cola') || product.product_name.includes('Coca Cola'))) {
                        return false;
                    }
                    return product.nutriments['energy-kcal_100g'] < 155;
                }

                if (typeOfDiet === 'Przybieranie na wadze') {
                    return product.nutriments['energy-kcal_100g'] > 500;
                }

                if (typeOfDiet === 'Utrzymanie wagi') {
                    if (product.product_name && (product.product_name.includes('Coca-Cola') || product.product_name.includes('Coca Cola'))) {
                        return false;
                    }
                    return product.nutriments['energy-kcal_100g'] > 155 && product.nutriments['energy-kcal_100g'] < 500;
                }

                return false;
            });
            return products;
        } else {
            console.warn('No products found or response format is incorrect.');
            return [];
        }
    } catch (error) {
        console.error('Error fetching diet products:', error);
        return [];
    }
};

export const fetchProductDataFromAPI = async (barcode) => {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v3/product/${barcode}.json`);
        return response.data.product || null;
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
};