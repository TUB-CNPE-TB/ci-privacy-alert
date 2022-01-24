const fs = require('fs');
var diff = require('deep-diff').diff;
const yaml = require("js-yaml");
const db = require("./db");

(async () => {
    const argv = require('minimist')(process.argv.slice(2));

    const sourcePath = argv._[0]
    const destinationPath = argv._[1]
    const connectionString = argv._[2]

    const sourceSpecification = fs.readFileSync(sourcePath, 'utf8')
    const sourceSpecificationJSON = yaml.load(sourceSpecification);

    let destinationSpecification = fs.readFileSync(destinationPath, 'utf8')
    const destinationSpecificationJSON = yaml.load(destinationSpecification);

    var differences = diff(sourceSpecificationJSON, destinationSpecificationJSON);

    await db.insert(connectionString, JSON.stringify(differences));

    process.exit();

})().catch((err) => console.log(err.stack));
