import locales from './locales'

var templates = [{
  name: 'mqtt',
  /* 다국어 키 표현을 어떻게.. */
  description: '...',
  /* 다국어 키 표현을 어떻게.. */
  group: 'dataSource',
  /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
  icon: '../',
  /* 또는, Object */
  template: {
    type: 'mqtt',
    model: {
      type: "mqtt",
      left: 10,
      top: 10,
      width: 100,
      height: 100,
      hidden: true,
      dataFormat: 'json'
    }
  }
}];

module.exports = {
  templates,
  locales
};
