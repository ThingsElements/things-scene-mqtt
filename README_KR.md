# Things Scene을 위한 MQTT 데이타소스 컴포넌트

## 개념

- MQTT 웹소켓 프로토콜로 토픽을 서브스크라이브 한다.
- 데이타 확산(Spread)는 데이터 바인딩에서 설정한다.

## 개발환경 만들기 (MacOS를 기준으로 함)

### MQTT 브로커로 mosquitto 설치하기

- homebrew를 이용해서 mosquitto를 설치한다.

```
$ brew install mosquitto
```

- Things Scene은 브라우저용이므로, MQTT 브로커에 웹소켓으로 접속할 수 있어야 한다. 그래서, mosquitto에 웹서비스 기능을 활성화한다.

```
$ echo -e "listener 1884\nprotocol websockets\nlistener 1883\nprotocol mqtt" >> /usr/local/opt/mosquitto/etc/mosquitto/mosquitto.conf
$ brew services restart mosquitto
```

## 설정

### MQTT 브로커로 mosquitto를 사용한 경우

- broker : hostname of the broker
- port : websocket service port number (default 1884)
- path : '/mqtt'
- user : username or blank
- password : password or blank
- topic : topic
- qos : QOS level [0, 1, 2]
- client-id : (unique) client id
- role : [publisher, subscriber]

```
클라이언트 아이디는 (브로커 입장에서) 유일한 연결 노드의 이름을 의미하며, 브로커에서 모니터링하기 위한 용도로 유일하게 적어준다.
클라이언트 아이디 속성을 비워두면, 자동으로 'THINGS-BOARD-{role}-{timestamp}‘로 자동 생성된다.
클라이언트 아이디 속성을 입력하면, 자동으로 '{client-id}-{role}-{timestamp}'로 자동 생성된다.
클라이언트 아이디 속성에 timestamp를 추가하는 이유는, 유일한 아이디를 만들기 위해서이다.
```

- data-format : [Plain Text, JSON]
- retain : true or false
- ssl : true or false (false)

### RabbitMQ의 MQTT-Websocket 플러그인을 사용한 경우

- broker : hostname of the broker
- port : websocket service port number (default 15675)
- path : '/ws'
- user : username or blank
- password : password or blank
- topic : topic
- qos : QOS level [0, 1, 2]
- client-id : (unique) client id
- role : [publisher, subscriber]

```
클라이언트 아이디는 (브로커 입장에서) 유일한 연결 노드의 이름을 의미하며, 브로커에서 모니터링하기 위한 용도로 유일하게 적어준다.
클라이언트 아이디 속성을 비워두면, 자동으로 'THINGS-BOARD-{role}-{timestamp}‘로 자동 생성된다.
클라이언트 아이디 속성을 입력하면, 자동으로 '{client-id}-{role}-{timestamp}'로 자동 생성된다.
클라이언트 아이디 속성에 timestamp를 추가하는 이유는, 유일한 아이디를 만들기 위해서이다.
```

- data-format : [Plain Text, JSON]
- retain : true or false
- ssl : true or false (false)

## Rabbit MQ의 MQTT-Websocket 플러그인을 사용하는 경우 메시지 Exchange

```
Rabbit MQ의 MQTT-Websocket 플러그인을 사용하는 경우,
durable 'topic' 타입의 'amq.topic' exchange에 의해서 라우팅된다.
따라서, 위 MQTT Data Source의 topic 속성은 라우팅 키의 역할을 한다.

Rabbit MQ의 AMQP를 사용해서 MQTT Data Source에서 받을 수 있도록 하려면,
아래의 javascript 샘플 코드를 참조하라.
```

```
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://hatiolab:hatiolab@mq.hatiolab.com', function(err, conn) {
  if(err) {
    console.error(err);
    return;
  }

  conn.createChannel(function (err, ch) {
    // exchange를 amq.topic 으로 설정하고, durable option을 true로 한다.
    var ex = 'amq.topic';

    ch.assertExchange(ex, 'topic', { durable: true });

    var location = {
      x: 100,
      y: 200
    };

    // topic 속성을 location 으로 설정한 경우.
    ch.publish(ex, 'location', new Buffer(JSON.stringify(location)));
  });
});
```

# Module

## UMD

- things-scene-mqtt.js (for modern browser)
- things-scene-mqtt-ie.js (for ie 11)

## ES Module

- things-scene-mqtt.mjs
