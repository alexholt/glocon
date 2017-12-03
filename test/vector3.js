const expect = require('chai').expect;

import Vector3 from '../src/client/vector3';

describe('A Vector with three components', () => {
  it('should be able to be accessed like an array', () => {
    const vec = new Vector3([0, 1, 2]);
    expect(vec[0]).to.equal(0);
    expect(vec[1]).to.equal(1);
    expect(vec[2]).to.equal(2);
  });

  it('should be able to be accessed with component aliases', () => {
    const vec = new Vector3([0, 1, 2]);
    expect(vec.x).to.equal(0);
    expect(vec.y).to.equal(1);
    expect(vec.z).to.equal(2);
  });

  it('should throw an exception if the components are not valid', () => {
    expect(() => new Vector3([NaN, null, 'str'])).to.throw();
  });

  it('should throw an exception if there are too many components', () => {
    expect(() => new Vector3([0, 0, 0, 0])).to.throw();
  });

  it('should provide a copy constructor', () => {
    const vec = new Vector3([0, 1, 2]);
    const other = new Vector3(vec);
    vec.x = 99;

    expect(vec.x).to.equal(99);
    expect(other.x).to.not.equal(99);
  });

  it('should support normalization', () => {
    const vec = new Vector3([0, 3, 4]);
    const normed = vec.normalize();
    expect(normed.isEqual(new Vector3([0, 3/5, 4/5]))).to.be.true;
  });

  it('should support dot products', () => {
    const vec = new Vector3([2, 2, 2]);
    expect(vec.dot(vec)).to.equal(12);
  });

  it('should support cross products', () => {
    let vec = new Vector3([1, 0, 0]);
    let other = new Vector3([0, 1, 0]);
    expect(vec.cross(other).isEqual(new Vector3([0, 0, 1]))).to.be.ok;

    vec = new Vector3([2, 3, 5]);
    other = new Vector3([-2, 3, 5]);
    expect(vec.cross(other).isEqual(new Vector3([0, -20, 12]))).to.be.ok;
  });

  it('should support magnitude', () => {
    let vec = new Vector3([0, 0, 1]);
    expect(vec.computeMagnitude()).to.equal(1);

    vec = new Vector3([2, 2, 2]);
    expect(vec.computeMagnitude()).to.equal(Math.sqrt(12));
  });
});