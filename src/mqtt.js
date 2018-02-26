/*
 * Copyright © HatioLab Inc. All rights reserved.
 */
import { Component, DataSource, RectPath, Shape } from '@hatiolab/things-scene'
import MQTT from 'paho-mqtt';

const NATURE = {
  mutable: false,
  resizable: true,
  rotatable: true,
  properties: [{
    type: 'string',
    label: 'broker',
    name: 'broker',
    property: 'broker',
    placeholder: 'WebSocket hostname'
  }, {
    type: 'number',
    label: 'port',
    name: 'port',
    property: 'port',
    placeholder: '15675'
  }, {
    type: 'string',
    label: 'path',
    name: 'path',
    property: 'path',
    placeholder: '/mqtt or /ws'
  }, {
    type: 'string',
    label: 'user',
    name: 'user',
    property: 'user'
  }, {
    type: 'string',
    label: 'password',
    name: 'password',
    property: 'password'
  }, {
    type: 'string',
    label: 'topic',
    name: 'topic',
    property: 'topic'
  }, {
    type: 'number',
    label: 'qos',
    name: 'qos',
    property: 'qos',
    placeholder: '0..2'
  }, {
    type: 'string',
    label: 'client-id',
    name: 'clientId',
    property: 'clientId'
  }, {
    type: 'select',
    label: 'data-format',
    name: 'dataFormat',
    property: {
      options: [{
        display: 'Plain Text',
        value: 'text'
      }, {
        display: 'JSON',
        value: 'json'
      }]
    }
  }, {
    type: 'checkbox',
    label: 'retain',
    name: 'retain',
    property: 'retain'
  }, {
    type: 'checkbox',
    label: 'ssl',
    name: 'ssl',
    property: 'ssl'
  }]
}

const MQTT_IMAGE = 'data:image/png;base64,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';

export default class Mqtt extends DataSource(RectPath(Shape)) {
  static get image() {
    if (!Mqtt._image) {
      Mqtt._image = new Image()
      Mqtt._image.src = MQTT_IMAGE
    }

    return Mqtt._image
  }

  added() {
    if (!this.app.isViewMode)
      return;

    this._initMqttConnection();
  }

  _initMqttConnection() {
    var {
      broker,
      port,
      clientId = 'THINGS-BOARD',
      topic,
      qos = 1,
      retain = false,
      path = '/mqtt',
      dataFormat = 'text',
      user,
      password,
      ssl = false
    } = this.model

    var client = new MQTT.Client(broker, port, path, [clientId, Date.now()].join('-'));

    client.onConnectionLost = responseObject => {
      console.log("connection lost: " + responseObject.errorMessage);
    };

    client.onMessageArrived = message => {
      this.data = this._convertDataFormat(message.payloadString, dataFormat)
    };

    var options = {
      useSSL: ssl,
      timeout: 30,
      onSuccess: function () {
        console.log("MQTT connected");
        client.subscribe(topic, {
          qos,
          onSuccess: () => {
            console.log('subscription success')
          },
          onFailure: (failure) => {
            console.log('subscription failed', failure.errorCode, failure.errorMessage)
          }
        });
      },
      onFailure: function (message) {
        console.log("MQTT connection failed: " + message.errorMessage);
      }
    };

    if(user)
      options.userName = user;
    if(password)
      options.password = password;

    this._client = client;
    this._client.connect(options);
  }

  dispose() {
    try {
      this._client && this._client.disconnect();
    } catch (e) {
      console.error(e)
    }
    delete this._client;

    super.dispose()
  }

  _draw(context) {

    var {
      left,
      top,
      width,
      height
    } = this.bounds;

    context.beginPath();
    context.drawImage(Mqtt.image, left, top, width, height);
  }

  get nature() {
    return NATURE;
  }

}

Component.register('mqtt', Mqtt);
