const client = require('./client');

module.exports = {
    getListOfIndices() {
        return client.cat.indices({ v: true });
    },

    createIndex(index) {
        return client.indices.create({ index });
    },

    deleteIndex(index) {
        return client.indices.delete({ index });
    },

    putMappings(index, type, mappings) {
        return client.indices.putMapping({
            index,
            type,
            body: mappings
        });
    }
};
