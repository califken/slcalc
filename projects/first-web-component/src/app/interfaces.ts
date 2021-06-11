export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  messagingtoken?: string;
  calculations?: Calculations;
}

export interface Calculations {
  uid: string;
  inputWidth?: number;
  inputLength?: number;
  inputTotal?: number;
  seedCost?: number;
  seedTotal?: number;
  fertilizeCost?: number;
  fertilizeTotal?: number;
  mowCost?: number;
  mowTotal?: number;
  numSqFtPerHour?: number;
  gallonsWaterPerSqFt?: number;
  totalWaterSavings?: number;
  totalCostSavings?: number;
  totalHoursSavings?: number;
  editvars?: boolean;
  editedvars?: boolean;
}

export interface CalculatorDefaultValues {
  annualcostofseed?: number;
  annualcostoffertilizer?: number;
  numbersquarefeetperhourofwork?: number;
  gallonsofwatersavedpersquarefootannually?: number;
}
