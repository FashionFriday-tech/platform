type SizeChartEntry = Record<string, string>;

interface SizeCategory {
  units: string[];
  chart: SizeChartEntry[];
}

interface SizeData {
  footwear: SizeCategory;
  apparel: SizeCategory;
}

export const sizeData: SizeData = {
  footwear: {
    units: ['IND / UK', 'US Men', 'US Women', 'Euro', 'CM', 'M / W'],
    chart: [
      { 'IND / UK': '3', 'US Men': '4', 'US Women': '5', Euro: '36', CM: '22.0', 'M / W': 'M3/W5' },
      { 'IND / UK': '4', 'US Men': '5', 'US Women': '6', Euro: '37', CM: '23.0', 'M / W': 'M4/W6' },
      { 'IND / UK': '5', 'US Men': '6', 'US Women': '7', Euro: '38', CM: '23.5', 'M / W': 'M5/W7' },
      { 'IND / UK': '6', 'US Men': '7', 'US Women': '8', Euro: '40', CM: '24.5', 'M / W': 'M6/W8' },
      { 'IND / UK': '7', 'US Men': '8', 'US Women': '9', Euro: '41', CM: '25.5', 'M / W': 'M7/W9' },
      {
        'IND / UK': '8',
        'US Men': '9',
        'US Women': '10',
        Euro: '42.5',
        CM: '26.5',
        'M / W': 'M8/W10',
      },
      {
        'IND / UK': '9',
        'US Men': '10',
        'US Women': '11',
        Euro: '44',
        CM: '27.5',
        'M / W': 'M9/W11',
      },
      {
        'IND / UK': '10',
        'US Men': '11',
        'US Women': '12',
        Euro: '45',
        CM: '28.5',
        'M / W': 'M10/W12',
      },
      {
        'IND / UK': '11',
        'US Men': '12',
        'US Women': '13',
        Euro: '46',
        CM: '29.5',
        'M / W': 'M11/W13',
      },
      {
        'IND / UK': '12',
        'US Men': '13',
        'US Women': '14',
        Euro: '47.5',
        CM: '30.5',
        'M / W': 'M12/W14',
      },
    ],
  },

  apparel: {
    units: ['Alpha Size', 'IND / UK', 'Chest (in)', 'Waist (in)'],
    chart: [
      { 'Alpha Size': 'XS', 'IND / UK': '34', 'Chest (in)': '34-36', 'Waist (in)': '28-30' },
      { 'Alpha Size': 'S', 'IND / UK': '36', 'Chest (in)': '36-38', 'Waist (in)': '30-32' },
      { 'Alpha Size': 'M', 'IND / UK': '38', 'Chest (in)': '38-40', 'Waist (in)': '32-34' },
      { 'Alpha Size': 'L', 'IND / UK': '40', 'Chest (in)': '40-42', 'Waist (in)': '34-36' },
      { 'Alpha Size': 'XL', 'IND / UK': '42', 'Chest (in)': '42-44', 'Waist (in)': '36-38' },
      { 'Alpha Size': 'XXL', 'IND / UK': '44', 'Chest (in)': '44-46', 'Waist (in)': '38-40' },
      { 'Alpha Size': 'XXXL', 'IND / UK': '46', 'Chest (in)': '46-48', 'Waist (in)': '40-42' },
      { 'Alpha Size': 'XXXXL', 'IND / UK': '48', 'Chest (in)': '48-50', 'Waist (in)': '42-44' },
    ],
  },
};
