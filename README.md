# osu-cs361-w23
Repo for CS 361 course project and microservice

## Microservice Communication Contract

---
### Initialization

1. Download and install RabbitMQ server. See [here](https://www.rabbitmq.com/download.html) for instructions.
1. Clone rns-ms.py and pip install [pika](https://pika.readthedocs.io/en/stable/#).
1. Start up a local RabbitMQ server on the default port 5672.
1. Run microservice process.
1. Connect your project to RabbitMQ and create a channel.

---
### How to Request Data

1. All requests shall be sent to the **'request'** queue, from which the microservice will be listening for requests.
1. Send a message to the **'request'** queue with a JSON payload of the format

```
    {'request': 'rng'}
```

**_Payload must match exactly._**

---
### How to Receive Data

1. The microservice will send all responses back on the **'response'** queue.
1. Consume messages from the **'response'** queue, which will contain a JSON payload of the format

```
    {'response': <int>}
```

where `<int>` is a random integer in the range [1,10] returned by the microservice.

---
### UML Sequence Diagram
