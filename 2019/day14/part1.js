const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '/input.txt');

const data = fs.readFileSync(filePath, { encoding: 'utf8' });
const lines = data.match(/[^\r\n]+/g);

// Convert the input data into an array of recipies.
let recipes = lines.map(l => {
    let parts = l.split(' => ');

    let output = partStringToObject(parts[1]);
    
    let inputParts = parts[0].split(',');

    let inputs = inputParts.map(partStringToObject);

    return {
        output,
        inputs
    };
});

let inventory = [];

let result = requiredOreToMakeProduct("FUEL", 1);

console.log(result);



function requiredOreToMakeProduct(product, qty) {
    let recipe = recipes.find(r => r.output.name == product);

    // Create an inventory item if it does not exist.
    let inventoryItem = inventory.find(s => s.name == product);

    if (!inventoryItem) {
        inventoryItem = {
            name: product,
            amount: 0
        };

        inventory.push(inventoryItem);
    }

    // Use the existing inventory item if there is any.
    let existing = inventoryItem.amount;

    // Calculate how many multiples of the product we need.
    let multiple = Math.ceil(Math.max((qty - existing), 0) / recipe.output.amount);

    // Calculate how much extra surplus there will be after manufacturing.
    let extra = (recipe.output.amount * multiple) - (qty - existing);

    // If it isn't ore then push the surplus into the inventory.
    if (product != "ORE") {
        inventoryItem.amount = extra;
    }

    let ore = 0;

    for (let i = 0; i < recipe.inputs.length; i++) {
        let input = recipe.inputs[i];

        // If the input is ore then we have reached bottom level.
        // Calculate how much ore we need.
        // Otherwise if not at ORE level yet, keep going down recursively
        // to calculate ore.
        if (input.name == "ORE") {
            ore += multiple * input.amount;
        } else {
            ore += requiredOreToMakeProduct(input.name, multiple * input.amount);
        }
    }
    
    return ore;
}

function partStringToObject(string) {
    let regPart = /(\d+)\s([A-Z]+)/;
    let part = regPart.exec(string);

    return {
        name: part[2],
        amount: parseInt(part[1])
    };
}
