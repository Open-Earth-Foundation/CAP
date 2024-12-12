import fs from 'fs';
import path from 'path';

// Function to convert city name to snake_case and replace non-English characters
const toSnakeCase = (str) => {
    return str
        .normalize('NFD') // Normalize the string
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
        .replace(/[^a-z\s]/g, '') // Remove non-English characters
        .replace(/\s+/g, '_'); // Replace spaces with underscores
};

// Read the JSON files
const priorityList = JSON.parse(fs.readFileSync('./input/adaptation/camacari.json', 'utf8'));
const genericActionList = JSON.parse(fs.readFileSync('./genericActionList.json', 'utf8'));

// Create a map of actions by ActionID for quick lookup
const actionMap = genericActionList.reduce((acc, action) => {
    acc[action.ActionID] = action;
    return acc;
}, {});

// Add action properties to the respective entry in the priority list
const enrichedPriorityList = priorityList.map(entry => {
    // console.log("entry", JSON.stringify(entry, null, 2)) // TODO NINA
    const action = actionMap[entry.actionId];
    return {
        ...entry,
        action
    };
});
console.log("enrichedPriorityList", JSON.stringify(enrichedPriorityList, null, 2)) // TODO NINA
// Group actions by city
const actionsByCity = enrichedPriorityList.reduce((acc, action) => {
    const cityName = action.name;
    if (cityName) {
        const fileName = toSnakeCase(cityName);
        if (!acc[fileName]) {
            acc[fileName] = [];
        }
        acc[fileName].push(action);
    }
    return acc;
}, {});

console.log("actionsByCity", JSON.stringify(actionsByCity, null, 2)) // TODO NINA

Object.entries(actionsByCity).forEach(([fileName, cityActions]) => {
    fs.writeFileSync(
        path.join(outputDir, `${fileName}.json`),
        JSON.stringify(cityActions, null, 4)
    );
});

console.log('JSON files created successfully.');