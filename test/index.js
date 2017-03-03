const chai = require('chai');
const expect = chai.expect;
chai.use(require('chai-json-schema'));
const jsonSchemaLoader = require('../index');

describe('Testing JSON-Schema with Chai', function () {
    it('#Testing', function () {

        const goodGeo = {
            longitude: 3,
            latitude: 4,
        };

        const badGeo = {
            longitude: "4",
            latitude: 4,
        };

        const schema = chai.tv4.getSchema('http://json-schema.org/geo');

        expect(goodGeo).to.be.jsonSchema(schema);
        expect(badGeo).not.to.be.jsonSchema(schema);
    });
});

// Before the test starts, we must load all the schemas.
// Use `mocha --delay` to tell mocha to wait for the 'run' function to be called when we are ready.

jsonSchemaLoader.loadJsonSchema('http://json-schema.org/geo', chai.tv4).then(function () {
    run()
});