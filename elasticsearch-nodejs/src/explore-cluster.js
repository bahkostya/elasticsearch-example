const client = require('./client');

module.exports = {
    pingCluster() {
        return client.ping({ requestTimeout: 30000 });
    },

    getClusterHealth() {
        return client.cluster.health();
    },

    getListOfNodes() {
        return client.cat.nodes({ v: true });
    }
};
