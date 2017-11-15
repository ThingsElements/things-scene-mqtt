# MQTT data source component for Things Scene
## Concept
* Subscribe the topic via MQTT Web Socket protocol.
* Data Spread is set in data binding.
## Creating a Development Environment (Based on MacOS)
### Installing mosquitto through MQTT Broker
* Use homebrew to install mosquitto.
```
$ brew install mosquitto
```
* Since Things Scene is for the browser, it must be accessible to MQTT broker via a web socket. So, enable the web service function on mosquitto.
```
$ echo -e "listener 1884\nprotocol websockets\nlistener 1883\nprotocol mqtt" >> /usr/local/opt/mosquitto/etc/mosquitto/mosquitto.conf
$ brew services restart mosquitto
```
## Setting
### When use mosquitto as a MQTT Broker
* broker : hostname of the broker
* port : websocket service port number (default 1884)
* path : '/mqtt'
* user : username or blank
* password : password or blank
* topic : topic
* qos : QOS level [0, 1, 2]
* client-id : (unique) client id
```
The client ID is the name of the only connection node (from the broker's point of view) and is unique for monitoring by the broker.
If leave the client ID property blank, it will be automatically created as 'THINGS-BOARD-{timestamp}'.
If enter the client ID property, it is automatically created as '{{client-id}}-{timestamp}'.
The reason for adding timestamp to the client ID property is to create a unique ID.
```
* data-format : [Plain Text, JSON]
* retain : true or false
* ssl : true or false (false)
### When use MQTT-Websocket Plug-in of RabbitMQ
* broker : hostname of the broker
* port : websocket service port number (default 15675)
* path : '/ws'
* user : username or blank
* password : password or blank
* topic : topic
* qos : QOS level [0, 1, 2]
* client-id : (unique) client id
```
The client ID is the name of the only connection node (from the broker's point of view) and is unique for monitoring by the broker.
If leave the client ID property blank, it will be automatically created as 'THINGS-BOARD-{timestamp}'.
If enter the client ID property, it is automatically created as '{{client-id}}-{timestamp}'.
The reason for adding timestamp to the client ID property is to create a unique ID.
```
* data-format : [Plain Text, JSON]
* retain : true or false
* ssl : true or false (false)
## Message Exchange when use MQTT-Websocket Plug-in of Rabbit MQ
```
If use MQTT-Websocket Plug-in of Rabbit MQ,
it is routed by 'amq.topic' exchange of durable 'topic' type.
Therefore, the topic property of the above MQTT Data Source acts as a routing key.

To receive from MQTT Data Source using AMQP of Rabbit MQ,
see the JavaScript sample code below.
```
```
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    // Set exchange to amq.topic and duplication option to true.
    var ex = 'amq.topic';

    ch.assertExchange(ex, 'topic', { durable: true });

    var location = {
      x: 100,
      y: 200
    };

    // When set the topic property to location
    ch.publish(ex, 'location', new Buffer(JSON.stringify(location)));
  });
});
```
