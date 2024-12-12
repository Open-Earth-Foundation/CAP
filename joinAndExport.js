import fs from 'fs';
import path from 'path';

const type = {
    ADAPTATION: 'adaptation',
    MITIGATION: 'mitigation'
}

// Function to convert city name to snake_case and replace non-English characters
const toSnakeCase = (str) => {
    if (!str) {
        return '';
    }
    return str
        .normalize('NFD') // Normalize the string
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .toLowerCase()
        .replace(/[^a-z\s]/g, '') // Remove non-English characters
        .replace(/\s+/g, '_'); // Replace spaces with underscores
};

function processCity(city, pathName) {
// Read the JSON files
    const priorityList = JSON.parse(fs.readFileSync(`./input/${pathName}/${city}.json`, 'utf8'));
    const genericActionList = JSON.parse(fs.readFileSync('./genericActionList.json', 'utf8'));

// Create a map of actions by ActionID for quick lookup
    const actionMap = genericActionList.reduce((acc, action) => {
        acc[action.ActionID] = action;
        return acc;
    }, {});

// Add action properties to the respective entry in the priority list
    const enrichedPriorityList = priorityList.map(entry => {

        const action = actionMap[entry.actionId];
        if (!action) {
            console.error(`No action found for Action ID: ${entry.actionId}`, entry);
            }

        return {
            ...entry,
            action
        };
    });

    // Get the city name from the first entry in the priority list
    const cityName = toSnakeCase(priorityList[0].cityName);

    // Create the output directory if it doesn't exist
    const outputDir = `./output/${pathName}`;
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
        console.log(`Created directory: ${outputDir}`);
    }

    // Write the enriched data to a file named <cityName>.json
    const filePath = path.join(outputDir, `${cityName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(enrichedPriorityList, null, 4));
    console.log(`File written: ${filePath}`);
}

const tuples = [{city: 'serra', pathName: type.ADAPTATION}, {city: 'serra', pathName: type.MITIGATION},
    {city: 'camacari', pathName: type.ADAPTATION}, {city: 'camacari', pathName: type.MITIGATION},
    {city: 'caxias_do_sul', pathName: type.ADAPTATION}, {city: 'caxias_do_sul', pathName: type.MITIGATION},
    {city: 'corumba', pathName: type.ADAPTATION}, {city: 'corumba', pathName: type.MITIGATION},
    {city: 'rio_branco', pathName: type.ADAPTATION}, {city: 'rio_branco', pathName: type.MITIGATION}
]

tuples.forEach(({city, pathName}) => {
    processCity(city, pathName);
})

