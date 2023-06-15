const representativeElectricity = (electricityUse, currency) => {
  const conversionFactor = currency === 'pounds' ? 147.5 * 125 : 125;
  return electricityUse / conversionFactor;
};

const energyIntensity = (representativeElectricity, deflatedGVA) => {
  return representativeElectricity / deflatedGVA;
};

const averageEnergyIntensity = (years) => {
  const totalEnergyIntensity = years.reduce((sum, year) => sum + year.energyIntensity, 0);
  return totalEnergyIntensity / years.length;
};

module.exports = {
  representativeElectricity,
  energyIntensity,
  averageEnergyIntensity,
};