import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';

const InputField = React.forwardRef(({ label, value, onChange }, ref) => {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={commonStyles.input}
                placeholder={`Enter ${label}`}
                keyboardType="numeric"
                value={value}
                onChange={onChange}
                ref={ref}
            />
        </View>
    );
});

const EBITDAPage = ({ navigation, route }) => {
    const { selectedYear, yearsBack, NACECode, electricityUsage } = route.params;
    const createYearsBackState = () => Array.from({ length: parseInt(yearsBack) }, (_, i) =>
        ({ [`_${i}_years_back`]: '' })
    ).reduce((acc, curr) => ({ ...acc, ...curr }), {});

    const [earnings, setEarnings] = useState(createYearsBackState());
    const [tax, setTax] = useState(createYearsBackState());
    const [interest, setInterest] = useState(createYearsBackState());
    const [depreciation, setDepreciation] = useState(createYearsBackState());
    const [amortization, setAmortization] = useState(createYearsBackState());


    const depRef = useRef();
    const amoRef = useRef();

    const handleInputChange = (event, year, field) => {
        const value = event.nativeEvent.text;
        switch (field) {
            case 'earnings':
                setEarnings((prevState) => ({ ...prevState, [`_${year}_years_back`]: value }));
                break;
            case 'tax':
                setTax((prevState) => ({ ...prevState, [`_${year}_years_back`]: value }));
                break;
            case 'interest':
                setInterest((prevState) => ({ ...prevState, [`_${year}_years_back`]: value }));
                break;
            case 'depreciation':
                setDepreciation((prevState) => ({ ...prevState, [`_${year}_years_back`]: value }));
                break;
            case 'amortization':
                setAmortization((prevState) => ({ ...prevState, [`_${year}_years_back`]: value }));
                break;
            default:
                break;
        }
    };


    const calculateEBITDA = () => {
        const ebitda = {};
        for (let i = 0; i < parseInt(yearsBack); i++) {
            const year = `_${i}_years_back`;
            const earningsValue = parseFloat(earnings[year]) || 0;
            const taxValue = parseFloat(tax[year]) || 0;
            const interestValue = parseFloat(interest[year]) || 0;
            const depValue = parseFloat(depreciation[year]) || 0;
            const amoValue = parseFloat(amortization[year]) || 0;
            ebitda[year] = earningsValue + taxValue + interestValue + depValue + amoValue;
        }
        return ebitda;
    };


    const isAnyFieldEmpty = () => {
        return (
            Object.values(earnings).some(value => value === '') ||
            Object.values(tax).some(value => value === '') ||
            Object.values(interest).some(value => value === '') ||
            Object.values(depreciation).some(value => value === '') ||
            Object.values(amortization).some(value => value === '')
        );
    };

    const handleNextPress = () => {
        const ebitda = calculateEBITDA();
        navigation.navigate('GVAInputPage', { selectedYear, yearsBack, ebitda, electricityUsage, NACECode });
    };


    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Enter EBITDA:</Text>
            <View style={commonStyles.card}>
                {Array.from({ length: parseInt(yearsBack) }, (_, i) => {
                    const fiscalYear = `FY${selectedYear - i}`;
                    const year = `_${i}_years_back`;
                    return (
                        <View key={year} style={commonStyles.inputCard}>
                            <Text style={commonStyles.cardTitle}>{fiscalYear} EBITDA Breakdown (£)</Text>
                            <InputField
                                label="Earnings"
                                value={earnings[year]}
                                onChange={(event) => handleInputChange(event, i, 'earnings')}
                                keyboardType="numeric"
                            />
                            <InputField
                                label="Interest"
                                value={interest[year]}
                                onChange={(event) => handleInputChange(event, i, 'interest')}
                                keyboardType="numeric"
                            />
                            <InputField
                                label="Tax"
                                value={tax[year]}
                                onChange={(event) => handleInputChange(event, i, 'tax')}
                                keyboardType="numeric"
                            />
                            <InputField
                                label="Depreciation"
                                value={depreciation[year]}
                                onChange={(event) => handleInputChange(event, i, 'depreciation')}
                                keyboardType="numeric"
                                ref={depRef}
                                onSubmitEditing={() => amoRef.current.focus()}
                            />
                            <InputField
                                label="Amortization"
                                value={amortization[year]}
                                onChange={(event) => handleInputChange(event, i, 'amortization')}
                                keyboardType="numeric"
                                ref={amoRef}
                            />
                        </View>
                    );
                })}
                <View style={[commonStyles.buttonContainer, { flexDirection: 'row' }]}>
                    <View style={{ flex: 1 }}>
                        <Button title="Back" onPress={() => navigation.goBack()} />
                    </View>
                    <View style={{ width: 10 }} />
                    <View style={{ flex: 1 }}>
                        <Button title="Next" onPress={handleNextPress} disabled={isAnyFieldEmpty()} />
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
});

export default EBITDAPage;