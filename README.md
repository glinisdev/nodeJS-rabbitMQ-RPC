### nodeJS-rabbitMQ-RPC (test task for a backend developer position)

### to run locally use provided .env as an example and execute in a terminal:

docker-compose up -d

### to test execute in a terminal:

curl --location 'localhost:3000/request' \
--header 'Content-Type: application/json' \
--data '{
    "message": "Hello there"
}'

it should return:

{
    "response": {
        "message": "Hello there",
        "handled": true
    }
}
