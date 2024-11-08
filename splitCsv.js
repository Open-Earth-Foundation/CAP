import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

// Function to convert city name to snake_case and replace non-English characters
const toSnakeCase = (str) => {
  return str
    .normalize('NFD') // Normalize the string
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .replace(/[^a-z\s]/g, '') // Remove non-English characters
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};

// Read the CSV file
const csvFile = fs.readFileSync('actions.csv', 'utf8');
const actions = Papa.parse(csvFile, { header: true }).data;

// Group actions by city
const actionsByCity = actions.reduce((acc, action) => {
  const cityName = action.city_name;
  if (cityName) {
    const fileName = toSnakeCase(cityName);
    if (!acc[fileName]) {
      acc[fileName] = [];
    }
    acc[fileName].push(action);
  }
  return acc;
}, {});

// Create a JSON file for each city
const outputDir = 'output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

Object.entries(actionsByCity).forEach(([fileName, cityActions]) => {
  fs.writeFileSync(
    path.join(outputDir, `${fileName}.json`),
    JSON.stringify(cityActions, null, 4)
  );
});

console.log('JSON files created successfully.');