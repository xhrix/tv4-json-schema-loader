const axios = require('axios');

/**
 * Loads the missing schemas in a 'tv4' object.
 *
 * @param {tv4} tv4
 * @return {Promise}
 */
module.exports.loadJsonSchemaDependencies = function (tv4) {

    return new Promise((resolve, reject) => {
        const missing = tv4.getMissingUris();

        if (missing.length === 0) {
            // All $ref's solved
            return resolve();
        }

        const schemaUri = missing.pop();

        axios.get(schemaUri).then(response => {
            if (!response.data) {
                return reject(new Error(`Fetch Json-Schema sub-dependency Error: Invalid response returned by: '${schemaUri}'.`));
            }
            tv4.addSchema(schemaUri, response.data);
            module.exports.loadJsonSchemaDependencies(tv4).then(resolve).catch(reject);
        }).catch(reject);
    });
};


/**
 * Loads the specified schema URI into the 'tv4' object. Also loads sub-schemas if needed.
 *
 * @param {string} schemaUri - Schema URI to load.
 * @param {tv4} tv4 - Object where to load the schemas. It must be an instance of the 'tv4' library.
 * @return {Promise}
 */
module.exports.loadJsonSchema = function (schemaUri, tv4) {
    return new Promise((resolve, reject) => {
        axios.get(schemaUri).then(response => {
            if (!response.data) {
                return reject(new Error(`Fetch Json-Schema Error: Invalid response returned by: '${schemaUri}'.`));
            }
            tv4.addSchema(schemaUri, response.data);
            module.exports.loadJsonSchemaDependencies(tv4).then(resolve).catch(reject);
        }).catch(reject);
    });
};

/**
 * Loads the specified schema URIs into the 'tv4' object. Also loads sub-schemas if needed.
 *
 * @param {string[]} schemaUris - Schema URIs to load.
 * @param {tv4} tv4 - Object where to load the schemas. It must be an instance of the 'tv4' library.
 * @return {Promise}
 */
module.exports.loadJsonSchemas = function (schemaUris, tv4) {
    return Promise.all(schemaUris.map(schemaUri => module.exports.loadJsonSchema(schemaUri, tv4)));
};
