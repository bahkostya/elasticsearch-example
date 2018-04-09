curl -H "Content-Type: application/json" -XPOST "localhost:9200/us_large_cities/city/_bulk?pretty&refresh" --data-binary "@insert_big_cities.json"
