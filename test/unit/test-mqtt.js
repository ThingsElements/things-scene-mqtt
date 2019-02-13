/*
 * Copyright © HatioLab Inc. All rights reserved.
 */

import './util'

import { expect } from 'chai'

import { create } from '@hatiolab/things-scene'
import { Mqtt } from '../../src/index'

describe('Mqtt', function () {

  var board;

  beforeEach(function () {
    board = create({
      model: {
        components: [{
          id: 'mqtt',
          type: 'mqtt'
        }]
      }
    })
  });

  it('component should be found by its id.', function () {

    var component = board.findById('mqtt')

    expect(!!component).not.to.equal(false);
  });
});
