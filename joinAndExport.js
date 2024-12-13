import fs from 'fs';
import path from 'path';

const type = {
    ADAPTATION: 'adaptation',
    MITIGATION: 'mitigation'
}

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

    // Create the output directory if it doesn't exist
    const outputDir = `./output/${pathName}`;
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true});
        console.log(`Created directory: ${outputDir}`);
    }

    // Write the enriched data to a file named <cityLocode>.json
    const filePath = path.join(outputDir, `${city}.json`);
    fs.writeFileSync(filePath, JSON.stringify(enrichedPriorityList, null, 4));
    console.log(`File written: ${filePath}`);
}


const tuples = [{city: 'BRSER', pathName: type.ADAPTATION}, {city: 'BRSER', pathName: type.MITIGATION},
    {city: 'BRCCI', pathName: type.ADAPTATION}, {city: 'BRCCI', pathName: type.MITIGATION},
    {city: 'BRCXL', pathName: type.ADAPTATION}, {city: 'BRCXL', pathName: type.MITIGATION},
    {city: 'BRCMG', pathName: type.ADAPTATION}, {city: 'BRCMG', pathName: type.MITIGATION},
    {city: 'BRRBR', pathName: type.ADAPTATION}, {city: 'BRRBR', pathName: type.MITIGATION}
]

tuples.forEach(({city, pathName}) => {
    processCity(city, pathName);
})

