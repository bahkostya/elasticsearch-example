## Elasticsearch.js API usage examples

### Run elasticsearch with kibana using docker:
`docker run -d -p 9200:9200 -p 5601:5601 nshou/elasticsearch-kibana`

### Try using Postman

1. Populate data from file:<br/>
`sh ./partial-search/populate-with-big-cities.sh`

2. Import collections of requests to Postman from `./postman-collection/elastic.postman_collection-v1.json`

3. Run requests in Postman

### Try using node.js

`cd ./elasticsearch-nodejs`

`yarn install`

`node index.js`
