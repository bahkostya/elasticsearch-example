const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);

const client = require('./client');

module.exports = {
    createDocument(index, document, id = undefined, type = '_doc') {
        return client.index({
            index,
            id,
            type,
            refresh: true,
            body: document
        });
    },

    updateDocument(index, document, id = undefined, type = '_doc') {
        return client.update({
            index,
            id,
            type,
            refresh: true,
            body: {
                doc: document
            }
        });
    },

    deleteDocument(index, id, type = '_doc') {
        return client.delete({
            index,
            id,
            type,
            refresh: true
        });
    },

    countAllDocuments(index) {
        return client.count({ index });
    },

    async populateWithDataFromFile(index, filePath, type = '_doc') {
        const fileContent = (await readFileAsync(filePath)).toString();

        return client.bulk({
            type,
            index,
            body: fileContent,
            refresh: 'wait_for'
        });
    }
};
