import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { commonStyles } from './commonStyles';

const ResultsPage = ({ navigation, route }) => {
    const { electricityUsage, yearsBack, calculatedGVA, NACECode } = route.params;
    const parsedElectricityUsage = Object.fromEntries(
        Object.entries(electricityUsage).map(([key, value]) => [key, value])
    );

    const validYears = Object.keys(calculatedGVA).filter((year) =>
        year.startsWith('_') &&
        Number(year.split('_')[1].split('_')[0]) < yearsBack &&
        calculatedGVA[year] !== 0 &&
        parsedElectricityUsage[year] !== 0
    );

    const [showDetails, setShowDetails] = useState(false);

    const calculatedValue =
        validYears.reduce((total, year) => {
            return total + parsedElectricityUsage[year] / calculatedGVA[year];
        }, 0) /
        (validYears.length || 1) *
        100;

    const toggleShowDetails = () => {
        setShowDetails(!showDetails);
    };

    const businessPassOrFail = calculatedValue > 20 ? 'Passed' : 'Failed';
    const sectorPassOrFail = NACECode !== 'None' ? 'Passed' : 'Failed';

    return (
        <View style={commonStyles.container}>
            <Text style={commonStyles.title}>Results</Text>
            <View style={commonStyles.card}>
                <Text style={commonStyles.cardTitle}>Average Energy Intensity: {calculatedValue.toFixed(2)}%</Text>
                <Text style={[commonStyles.cardText, businessPassOrFail === 'Passed' ? styles.passed : styles.failed]}>
                    Business Level Test: {businessPassOrFail}
                </Text>
                <Text style={[commonStyles.cardText, sectorPassOrFail === 'Passed' ? styles.passed : styles.failed]}>
                    Sector Level Test: {sectorPassOrFail}
                </Text>
                <Button
                    title={showDetails ? "Hide Calculations" : "Show Calculations"}
                    onPress={toggleShowDetails}
                />
                {showDetails && validYears.map((year) => {
                    const fiscalYear = `FY${new Date().getFullYear() - Number(year.split('_')[1].split('_')[0])}`;
                    return (
                        <View key={year} style={styles.details}>
                            <Text style={commonStyles.label}>{fiscalYear}</Text>
                            <Text style={commonStyles.cardText}>Representative Electricity Cost: £{parsedElectricityUsage[year].toFixed(2)}</Text>
                            <Text style={commonStyles.cardText}>Deflated GVA: £{calculatedGVA[year].toFixed(2)}</Text>
                            <Text style={commonStyles.cardText}>Ratio: {(parsedElectricityUsage[year] / calculatedGVA[year] * 100).toFixed(2)}%</Text>
                        </View>
                    )
                })}
                <Button
                    title="Recalculate"
                    onPress={() => navigation.navigate('NACECodePage')}
                    style={styles.recalculateButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    passed: {
        color: 'green'
    },
    failed: {
        color: 'red'
    },
    details: {
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#f0f0f0'
    },
    recalculateButton: {
        marginTop: 10,
    },
});

export default ResultsPage;
