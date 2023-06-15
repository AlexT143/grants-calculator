import React, { useState } from 'react';
import { View, Button, Text, Picker, StyleSheet } from 'react-native';
import NACECodes from '../data/NACECodes';
import DropDownPicker from 'react-native-dropdown-picker';
import { commonStyles } from './commonStyles';

const NACECodePage = ({ navigation }) => {
    const [NACECode, setNACECode] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(NACECodes);
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [yearsBack, setYearsBack] = useState('1');  // New state variable
    const yearDropdownItems = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return <Picker.Item key={year} label={year.toString()} value={year.toString()} />;
    });
    // New picker items for years back
    const yearsBackItems = Array.from({ length: 5 }, (_, i) => {
        const year = i + 1;
        return <Picker.Item key={year} label={year.toString()} value={year.toString()} />;
    });

    const handlePickerChange = (value) => {
        setSelectedYear(value);
    };

    const handleYearsBackChange = (value) => {
        setYearsBack(value);
    };

    const handleNACECodeChange = (newValue) => {
        setNACECode(newValue);
    };

    const isNextButtonDisabled = () => {
        return NACECode === '';
    };

    const handleNextButtonPress = () => {
        navigation.navigate('ElectricityUsagePage', { selectedYear, yearsBack, NACECode });
    };

    return (
        <View style={[commonStyles.container, styles.container]}>
            <Text style={[commonStyles.title, styles.title]}>Qualification test for the Energy Intensive Industries (EIIS) scheme</Text>
            <View style={commonStyles.card}>
                <View>
                    <View style={styles.pickerContainer}>
                        <Text style={commonStyles.label}>Year:</Text>
                        <Picker style={styles.picker} selectedValue={selectedYear} onValueChange={handlePickerChange}>
                            {yearDropdownItems}
                        </Picker>
                    </View>
                    <View style={styles.pickerContainer}>
                        <Text style={commonStyles.label}>How many years are you looking back on?</Text>
                        <Picker style={styles.picker} selectedValue={yearsBack} onValueChange={handleYearsBackChange}>
                            {yearsBackItems}
                        </Picker>
                    </View>
                </View>
                <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.dropDownPicker}
                    onChangeValue={handleNACECodeChange}
                />
                <Button
                    title="Next"
                    onPress={handleNextButtonPress}
                    disabled={isNextButtonDisabled()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    title: {
        marginBottom: 20,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        justifyContent: 'space-between',

    },
    picker: {
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
    dropDownPicker: {
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 1,
    },
});

export default NACECodePage;
