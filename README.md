# Things Scene을 위한 MQTT 데이타소스 컴포넌트
## 개념
* MQTT 웹소켓 프로토콜로 토픽을 서브스크라이브 한다.
* 토픽과 같은 ID를 가진 컴포넌트의 data에 메시지를 전달한다.
* JSON 형태의 메시지만 지원한다.
## 개발환경 만들기 (MacOS를 기준으로 함)
### MQTT 브로커로 mosquitto 설치하기
* homebrew를 이용해서 mosquitto를 설치한다.
```
$ brew install mosquitto
```
* Things Scene은 브라우저용이므로, MQTT 브로커에 웹소켓으로 접속할 수 있어야 한다. 그래서, mosquitto에 웹서비스 기능을 활성화한다.
```
$ echo -e "listener 1884\nprotocol websockets\nlistener 1883\nprotocol mqtt" >> /usr/local/opt/mosquitto/etc/mosquitto/mosquitto.conf
$ brew services restart mosquitto
```
