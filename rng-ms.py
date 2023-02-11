#!/usr/bin/env python
import json
import pika
import random
import sys

HOST = "localhost"
REQ_QUEUE = "request"
RESP_QUEUE = "response"
LOWER_BOUND = 1
UPPER_BOUND = 10


class RNGService:
    def __init__(
        self,
        hostname: str = HOST,
        req_queue: str = REQ_QUEUE,
        resp_queue: str = RESP_QUEUE,
    ) -> None:
        self.hostname = hostname
        self.req_queue = req_queue
        self.resp_queue = resp_queue
        random.seed()

    def createChannel(self):
        print(f"Connecting to host {self.hostname}...")
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=self.hostname)
        )
        return connection.channel()

    def consume(self) -> None:
        print(f"Creating queues {self.req_queue} and {self.resp_queue}...")
        self.channel.queue_declare(queue=self.req_queue, durable=False)
        self.channel.queue_declare(queue=self.resp_queue, durable=False)

        self.channel.basic_consume(
            queue=self.req_queue,
            on_message_callback=self.procMsgCallback,
            auto_ack=True,
        )

        print(" [*] Waiting for messages. To exit press CTRL+C")
        self.channel.start_consuming()

    def procMsgCallback(self, ch, method, properties, body) -> None:
        print(f"Received message with body {body}")
        request = json.loads(body)

        try:
            if request["request"] == "rng":
                randInt = random.randint(LOWER_BOUND, UPPER_BOUND)
                respBody = json.dumps({"response": randInt})
        except:
            respBody = json.dumps({"response": "ERROR"})

        print(f"Sending back message with body {respBody}")
        self.channel.basic_publish(exchange="", routing_key=RESP_QUEUE, body=respBody)

    def start(self) -> None:
        self.channel = self.createChannel()
        self.consume()


if __name__ == "__main__":
    service = RNGService()
    try:
        service.start()
    except KeyboardInterrupt:
        print("Exiting...")
        sys.exit(0)
