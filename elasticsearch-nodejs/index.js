const assert = require('assert');
const {
    pingCluster,
    getClusterHealth,
    getListOfNodes
} = require('./src/explore-cluster');
const {
    getListOfIndices,
    createIndex,
    deleteIndex,
    putMappings
} = require('./src/indices-operations');
const {
    createDocument,
    countAllDocuments,
    deleteDocument,
    updateDocument,
    populateWithDataFromFile
} = require('./src/documents-operations');
const client = require('./src/client');

(async () => {
    try {
        console.log('CLUSTER INFO');

        await pingCluster();
        await getClusterHealth();
        await getListOfNodes();

        // ===================================================================

        console.log('INDICES CREATION AND DELETION CHECK');

        await getListOfIndices();
        await createIndex('customers');
        await getListOfIndices();
        await deleteIndex('customers');
        await getListOfIndices();

        await deleteIndex('cities');
        await createIndex('cities');
        await putMappings('cities', 'city', {
            properties: {
                city: { type: 'text' },
                state: { type: 'text' },
                location: { type: 'geo_point' }
            }
        });

        // ===================================================================

        console.log('DOCUMENTS CREATION, MODIFYING AND DELETION CHECK');

        const createdDocument = await createDocument('customers', {
            name: 'John Doe'
        });
        assert.strictEqual(createdDocument.result, 'created');

        const updatedDocument = await updateDocument(
            'customers',
            {
                name: 'Bob Smith'
            },
            createdDocument._id
        );
        assert.strictEqual(updatedDocument.result, 'updated');

        const countDocumentsBeforeDeletion = (await countAllDocuments(
            'customers'
        )).count;
        await deleteDocument(createdDocument._index, createdDocument._id);
        const countDocumentsAfterDeletion = (await countAllDocuments(
            'customers'
        )).count;
        assert.strictEqual(
            countDocumentsBeforeDeletion - 1,
            countDocumentsAfterDeletion
        );

        await deleteIndex('customers');

        await populateWithDataFromFile(
            'cities',
            '../partial-search/big-cities.json',
            'city'
        );

        // ===================================================================

        console.log('SEARCHING');

        await client.search({
            index: 'cities',
            body: {
                sort: [
                    {
                        _geo_distance: {
                            location: {
                                lat: 37.9174,
                                lon: -122.305
                            }
                        }
                    }
                ],
                query: {
                    bool: {
                        must: {
                            match_all: {}
                        },
                        filter: {
                            geo_distance: {
                                distance: '20km',
                                location: {
                                    lat: 37.9174,
                                    lon: -122.305
                                }
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error(error);
    }
})();
