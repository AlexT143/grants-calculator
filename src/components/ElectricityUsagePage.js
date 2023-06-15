import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, Picker, StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';

const ElectricityUsagePage = ({ navigation, route }) => {
    const { selectedYear, yearsBack, NACECode } = route.params;
    const [electricityUsage, setElectricityUsage] = useState(
        Array.from({ length: parseInt(yearsBack) }, (_, i) =>
            ({ [`_${i}_years_back`]: '' })
        ).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    );



    const [unitOfMeasure, setUnitOfMeasure] = useState('£');


    const handleInputChange = (event, key) => {
        const value = event.nativeEvent.text.replace(/[^0-9.]/g, ''); // extract only numeric value
        setElectricityUsage((prevUsage) => ({
            ...prevUsage,
            [`_${key}_years_back`]: value,
        }));
    };


    const handleUnitOfMeasureChange = (value) => {
        setUnitOfMeasure(value);
    };

    const isNextButtonDisabled = () => {
        return Object.values(electricityUsage).some(value => value === '');
    };


    const handleNextButtonPress = () => {
        const factor = unitOfMeasure === '£' ? 125 / 147.5 : 125;
        const normalizedElectricityUsage = Object.entries(electricityUsage).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]: value * factor
            };
        }, {});

        console.log(normalizedElectricityUsage)
        navigation.navigate('EBITDAPage', { selectedYear, yearsBack, NACECode, electricityUsage: normalizedElectricityUsage });
    };

    const renderInput = (label, value, onChange) => {
        const placeholder = unitOfMeasure === '£' ? 'Enter usage in £' : 'Enter usage in MWh';
        return (
            <View style={commonStyles.inputCard}>
                <Text style={commonStyles.cardTitle}>{label}</Text>
                <View style={commonStyles.inputContainer}>
                    <View style={commonStyles.inputWrapper}>
                        <TextInput
                            style={commonStyles.input}
                            placeholder={placeholder}
                            keyboardType="numeric"
                            value={value}
                            onChange={(event) => onChange(event, label)}
                        />
                    </View>
                </View>
            </View>
        );
    };

    useEffect(() => {
        console.log(electricityUsage);
    }, [electricityUsage]);

    return (
        <View style={commonStyles.container}>
            <View style={commonStyles.header}>
                <Text style={commonStyles.title}>Enter electricity usage:</Text>
            </View>
            <View style={commonStyles.card}>
                <View style={styles.unitOfMeasureContainer}>
                    <Text style={commonStyles.label}>Unit of measure:</Text>
                    <Picker
                        style={styles.unitOfMeasurePicker}
                        selectedValue={unitOfMeasure}
                        onValueChange={handleUnitOfMeasureChange}
                    >
                        <Picker.Item label="£" value="£" />
                        <Picker.Item label="MWh" value="MWh" />
                    </Picker>
                </View>
                {Array.from({ length: parseInt(yearsBack) }, (_, i) =>
                    renderInput(
                        `${selectedYear - i} Electricity Use (${unitOfMeasure})`,
                        electricityUsage[`_${i}_years_back`],
                        (event) => handleInputChange(event, i)
                    )
                )}
                <View style={[commonStyles.buttonContainer, { flexDirection: 'row' }]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Back" onPress={() => navigation.goBack()} />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Button
                            title="Next"
                            onPress={handleNextButtonPress}
                            disabled={isNextButtonDisabled()}
                            style={isNextButtonDisabled() ? styles.disabledButton : null}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    unitOfMeasureContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',

    },
    unitOfMeasurePicker: {
        marginLeft: 10,
        marginTop: -2,
        padding: 10,
        height: 40,
        borderRadius: 10,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        flex: 1,
    },
    unitOfMeasure: {
        marginLeft: 10,
        fontSize: 16,
    },
    disabledButton: {
        backgroundColor: 'rgba(211, 211, 211, 0.5)',
    },
});

export default ElectricityUsagePage;

