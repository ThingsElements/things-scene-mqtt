import editors from './src/editors'
import locales from './locales'

var templates = [{
  name: 'Round Button',
  /* 다국어 키 표현을 어떻게.. */
  description: '...',
  /* 다국어 키 표현을 어떻게.. */
  group: 'dataSource',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: '../',
  /* 또는, Object */
  template: {
    type: 'MQTT',
    model: {
      type: 'mqtt',
      width: 100,
      height: 100,
      text: 'SAMPLE-BUTTON'
    }
  }
}];

module.exports = {
  templates,
  editors,
  locales
};
