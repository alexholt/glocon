const expect = require('chai').expect;
import Vector3 from '../src/client/vector3';

import Circle from '../src/client/circle';

describe('A circle', () => {

  it('can be constructed from perimeter points', () => {
    const circle = Circle.fromPerimeterPoints([{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}]);
    expect(circle.center.isEqual(new Vector3([0, 0, 0]))).to.be.ok;
  });

});
