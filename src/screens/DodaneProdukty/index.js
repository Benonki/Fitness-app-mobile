import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { ProductContext } from '../../context/ProductContext';
import { AntDesign } from '@expo/vector-icons';
import styles from './StyleSheet.js';
import nonScannableProductsData from './nonScannableProducts.json';

const DodaneProduktyScreen = () => {
    const { products, getTotalNutrients, removeProduct, addProduct, lastDate } = useContext(ProductContext);
    const totals = getTotalNutrients();

    const nonScannableProducts = nonScannableProductsData.nonScannableProducts;
    const [modalVisible, setModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('nonScannable');
    const [selectedTileIndex, setSelectedTileIndex] = useState(null);
    const [quantity, setQuantity] = useState('');

    const [productName, setProductName] = useState('');
    const [calories, setCalories] = useState('');
    const [fat, setFat] = useState('');
    const [sugar, setSugar] = useState('');
    const [proteins, setProteins] = useState('');
    const [weight, setWeight] = useState('');
    const [isPer100g, setIsPer100g] = useState(null);

    const handleAddProduct = () => {
        if (activeTab === 'nonScannable') {
            if (selectedTileIndex === null) {
                Alert.alert('Błąd', 'Wybierz produkt z listy.');
                return;
            }
            if (!quantity || Number(quantity) <= 0) {
                Alert.alert('Błąd', 'Podaj prawidłową ilość.');
                return;
            }

            const selectedProduct = nonScannableProducts[selectedTileIndex];
            const qty = Number(quantity);

            const newProduct = {
                name: `${selectedProduct.name} (${qty}x)`,
                calories: selectedProduct.calories * qty,
                fat: selectedProduct.fat * qty,
                sugar: selectedProduct.sugar * qty,
                proteins: selectedProduct.proteins * qty,
            };

            addProduct(newProduct);
            setModalVisible(false);
            setSelectedTileIndex(null);
            setQuantity(null);
        } else {
            if (!productName.trim()) {
                Alert.alert('Błąd', 'Nazwa produktu jest wymagana.');
                return;
            }
            if (Number(calories) <= 0) {
                Alert.alert('Błąd', 'Kalorie muszą być większe niż 0.');
                return;
            }

            if (fat.trim() !== '' && Number(fat) < 0) {
                Alert.alert('Błąd', 'Tłuszcz nie może mieć wartości ujemnej.');
                return;
            }
            if (sugar.trim() !== '' && Number(sugar) < 0) {
                Alert.alert('Błąd', 'Cukier nie może mieć wartości ujemnej.');
                return;
            }
            if (proteins.trim() !== '' && Number(proteins) < 0) {
                Alert.alert('Błąd', 'Białko nie może mieć wartości ujemnej.');
                return;
            }

            if (isPer100g === null) {
                Alert.alert('Błąd', 'Wybierz, czy podano wartości dla 100g czy całego produktu.');
                return;
            }
            if (isPer100g && (!weight || Number(weight) <= 0)) {
                Alert.alert('Błąd', 'Podaj ilość gramów, którą zjadłeś.');
                return;
            }

            const fatValue = fat.trim() === '' ? 0 : Number(fat);
            const sugarValue = sugar.trim() === '' ? 0 : Number(sugar);
            const proteinsValue = proteins.trim() === '' ? 0 : Number(proteins);

            const factor = isPer100g ? Number(weight) / 100 : 1;

            const newProduct = {
                name: productName,
                calories: Number(calories) * factor,
                fat: Math.max(0, fatValue) * factor,
                sugar: Math.max(0, sugarValue) * factor,
                proteins: Math.max(0, proteinsValue) * factor,
            };

            addProduct(newProduct);
            setModalVisible(false);
            resetForm();
        }
    };

    const resetForm = () => {
        setProductName('');
        setCalories('');
        setFat('');
        setSugar('');
        setProteins('');
        setWeight('');
        setIsPer100g(null);
        setSelectedTileIndex(null);
        setQuantity('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Dzisiejsza data: {lastDate}</Text>
            </View>

            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.productItem}>
                        <View>
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productDetails}>
                                Kalorie: {item.calories ? Number(item.calories).toFixed(2) : '0'} |
                                Tłuszcz: {item.fat ? Number(item.fat).toFixed(2) : '0'}g |
                                Cukry: {item.sugar ? Number(item.sugar).toFixed(2) : '0'}g |
                                Białko: {item.proteins ? Number(item.proteins).toFixed(2) : '0'}g
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => removeProduct(index)} style={styles.removeButton}>
                            <AntDesign name="minuscircleo" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View style={styles.totalsContainer}>
                <Text style={styles.totalsText}>Łączne Kalorie: {totals.calories.toFixed(2)}</Text>
                <Text style={styles.totalsText}>Tłuszcz: {totals.fat.toFixed(2)}g</Text>
                <Text style={styles.totalsText}>Cukry: {totals.sugar.toFixed(2)}g</Text>
                <Text style={styles.totalsText}>Białko: {totals.proteins.toFixed(2)}g</Text>
            </View>

            <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.floatingButtonText}>Dodaj produkt nieskanowalny</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Dodaj produkt</Text>

                        <View style={styles.tabSwitchContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.tabSwitchButton,
                                    activeTab === 'nonScannable' && styles.tabSwitchButtonActive
                                ]}
                                onPress={() => setActiveTab('nonScannable')}
                            >
                                <Text style={styles.tabSwitchButtonText}>LISTA  PRODUKTÓW</Text>
                            </TouchableOpacity>
                            <View style={styles.tabSwitchDivider} />
                            <TouchableOpacity
                                style={[
                                    styles.tabSwitchButton,
                                    activeTab === 'custom' && styles.tabSwitchButtonActive
                                ]}
                                onPress={() => setActiveTab('custom')}
                            >
                                <Text style={styles.tabSwitchButtonText}>PRODUKT NIESTANDARDOWY</Text>
                            </TouchableOpacity>
                        </View>

                        {activeTab === 'nonScannable' ? (
                            <>
                                <ScrollView style={styles.productListContainer}>
                                    {nonScannableProducts.map((product, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                styles.productItem,
                                                selectedTileIndex === index && styles.selectedProductTile
                                            ]}
                                            onPress={() => setSelectedTileIndex(index)}
                                        >
                                            <View>
                                                <Text style={styles.productName}>{product.name}</Text>
                                                <Text style={styles.productTileDetails}>
                                                    Kalorie: {product.calories} | Tłuszcz: {product.fat}g |
                                                    Cukry: {product.sugar}g | Białko: {product.proteins}g
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ile sztuk zjadłeś?"
                                    keyboardType="numeric"
                                    value={quantity}
                                    onChangeText={setQuantity}
                                />
                            </>
                        ) : (
                            <>
                                <TextInput style={styles.input} placeholder="Nazwa produktu" value={productName} onChangeText={setProductName} />
                                <TextInput style={styles.input} placeholder="Kalorie" keyboardType="numeric" value={calories} onChangeText={setCalories} />
                                <TextInput style={styles.input} placeholder="Tłuszcz (opcjonalnie)" keyboardType="numeric" value={fat} onChangeText={setFat} />
                                <TextInput style={styles.input} placeholder="Cukry (opcjonalnie)" keyboardType="numeric" value={sugar} onChangeText={setSugar} />
                                <TextInput style={styles.input} placeholder="Białko (opcjonalnie)" keyboardType="numeric" value={proteins} onChangeText={setProteins} />
                                <Text style={styles.modalTitle2}>Podałeś wartości na {"\n"} 100 gramów czy już cały posiłek?</Text>
                                <View style={styles.switchContainer}>
                                    <TouchableOpacity
                                        style={[styles.switchButton, isPer100g === true && styles.switchButtonActive]}
                                        onPress={() => setIsPer100g(true)}
                                    >
                                        <Text style={styles.switchButtonText}>100G</Text>
                                    </TouchableOpacity>
                                    <View style={styles.switchDivider} />
                                    <TouchableOpacity
                                        style={[styles.switchButton, isPer100g === false && styles.switchButtonActive]}
                                        onPress={() => setIsPer100g(false)}
                                    >
                                        <Text style={styles.switchButtonText}>CAŁOŚĆ</Text>
                                    </TouchableOpacity>
                                </View>

                                {isPer100g && (
                                    <TextInput style={styles.input} placeholder="Ile gramów zjadłeś?" keyboardType="numeric" value={weight} onChangeText={setWeight} />
                                )}
                            </>
                        )}

                        <TouchableOpacity style={styles.modalButton} onPress={handleAddProduct}>
                            <Text style={styles.modalButtonText}>Dodaj</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalCloseButton} onPress={() => {
                            setModalVisible(false);
                            setSelectedTileIndex(null);
                            setQuantity('1');
                            if (activeTab === 'custom') resetForm();
                        }}>
                            <Text style={styles.modalCloseText}>Anuluj</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DodaneProduktyScreen;