import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';

const GVAInputPage = ({ navigation, route }) => {
    const { selectedYear, yearsBack, NACECode, electricityUsage, ebitda } = route.params;
    console.log(route.params)
    const [gva, setGVA] = useState(
        Array.from({ length: parseInt(yearsBack) }, (_, i) =>
            ({ [`_${i}_years_back`]: '0' })
        ).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    );

    const [staffCosts, setStaffCosts] = useState(
        Array.from({ length: yearsBack }, (_, i) =>
            ({ [`_${i}_years_back`]: '' })
        ).reduce((acc, curr) => ({ ...acc, ...curr }), {})
    );


    console.log(route.params);
    // const handleGVAChange = (event, year) => {
    //     const value = event.nativeEvent.text;
    //     setGVA((prevState) => ({ ...prevState, [year]: value }));
    // };

    const handleStaffCostsChange = (event, i) => {
        const value = event.nativeEvent.text;
        setStaffCosts((prevState) => ({ ...prevState, [`_${i}_years_back`]: value }));
    };


    const calculateGVA = () => {
        const gva = {};
        for (let i = 0; i < parseInt(yearsBack); i++) {
            const year = `_${i}_years_back`;
            const ebitdaValue = parseFloat(ebitda[year]) || 0;
            const staffCostsValue = parseFloat(staffCosts[year]) || 0;
            gva[year] = (ebitdaValue + staffCostsValue) * 0.84059;
        }
        return gva;
    };


    const handleNextPress = () => {
        const calculatedGVA = calculateGVA();
        setGVA(calculatedGVA);
        navigation.navigate('ResultsPage', { electricityUsage, yearsBack, calculatedGVA, NACECode });
    };
    console.log(parseInt(selectedYear))
    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Enter GVA and Staff Costs:</Text>
            <View style={commonStyles.card}>
                {Array.from({ length: parseInt(yearsBack) }, (_, i) => {
                    const year = `_${i}_years_back`;
                    const fiscalYear = `FY${parseInt(selectedYear) - i}`;
                    return (
                        <View key={year} style={commonStyles.inputCard}>
                            <Text style={commonStyles.cardTitle}>{fiscalYear}</Text>
                            <View style={styles.inputContainer}>
                                <Text style={commonStyles.label}>Staff Costs:</Text>
                                <View style={commonStyles.inputWrapper}>
                                    <TextInput
                                        style={commonStyles.input}
                                        placeholder={`Enter Staff Costs for ${fiscalYear} (£)`}
                                        keyboardType="numeric"
                                        value={staffCosts[year]}
                                        onChange={(event) => handleStaffCostsChange(event, i)}
                                    />
                                </View>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={commonStyles.label}>GVA (£)</Text>
                                <View style={commonStyles.inputWrapper}>
                                    <Text style={commonStyles.input}>
                                        {parseFloat(ebitda[year]) + (staffCosts[year] ? parseFloat(staffCosts[year]) : 0)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
                <View style={[commonStyles.buttonContainer, { flexDirection: 'row' }]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Back" onPress={() => navigation.goBack()} />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Button title="Next" onPress={handleNextPress} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    yearContainer: {
        marginBottom: 20,
    },
    year: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginLeft: 20,
    },
    buttonContainer: {
        marginTop: 20,
    },
});

export default GVAInputPage;
