#!/usr/bin/env python
import json
import pika
import sys

from abc import abstractmethod

HOST = "localhost"
REQ_QUEUE = "request"
RESP_QUEUE = "response"


class Client:
    def __init__(
        self,
        queue: str,
        hostname: str = HOST,
    ) -> None:
        self.queue = queue
        self.hostname = hostname

    def createChannel(self):
        return self.connection.channel()

    def connect(self):
        print(f"Connecting to host {self.hostname}...")
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=self.hostname)
        )
        return connection

    def consume(self) -> None:
        print(f"Creating queues {self.queue}...")
        self.channel.queue_declare(queue=self.queue, durable=False)

        self.channel.basic_consume(
            queue=self.queue,
            on_message_callback=self.procMsgCallback,
            auto_ack=True,
        )

        self.channel.start_consuming()

    def procMsgCallback(self, ch, method, properties, body) -> None:
        print(f"Received message with body {body}")
        self.connection.close()

    def sendMsg(self) -> None:
        body = json.dumps({"request": "rng"})
        print(f"Sending message with {body}")
        self.channel.basic_publish(exchange="", routing_key=self.queue, body=body)

    @abstractmethod
    def start(self) -> None:
        raise NotImplementedError()


class Producer(Client):
    def start(self) -> None:
        self.connection = self.connect()
        self.channel = self.createChannel()
        self.sendMsg()


class Consumer(Client):
    def start(self) -> None:
        self.connection = self.connect()
        self.channel = self.createChannel()
        self.consume()


if __name__ == "__main__":
    producer = Producer(queue=REQ_QUEUE)
    consumer = Consumer(queue=RESP_QUEUE)
    try:
        producer.start()
        consumer.start()
    except KeyboardInterrupt:
        print("Exiting...")
        sys.exit(0)
