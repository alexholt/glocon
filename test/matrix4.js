const expect = require('chai').expect;

import Matrix4 from '../src/client/matrix4';

describe('A Matrix with 16 components', () => {
  it('should be able to be accessed like an array', () => {
    const mat = Matrix4.makeIdentity();
    expect(mat[0]).to.equal(1);
    expect(mat[15]).to.equal(1);
  });

  it('should be able to be accessed with x and y', () => {
    const mat = Matrix4.makeIdentity();
    expect(mat.getXY(0, 0)).to.equal(1);
    expect(mat.getXY(3, 3)).to.equal(1);
  });

  it('can be loaded from a C-style string literal', () => {
    expect(
      Matrix4.parse('{{1,0,0,0}, {0,1,0,0}, {0,0,1,0}, {0,0,0,1}}')
        .isEqual(Matrix4.makeIdentity())
    ).to.be.ok;
  });

  xit('should be invertible', () => {
    let mat = Matrix4.makeIdentity();
    expect(mat.invert().isEqual(mat)).to.be.ok;
    mat = Matrix4.makeCamera()
    expect(
      mat.invert().isEqual(Matrix4.parse('{{0,1,0,0},{1,0,0,0},{0,0,1,0},{0,0,-1,1}}'))
    ).to.be.ok;
  });

  it('should be multipliable', () => {
    const viewMatrix = Matrix4.parse('{ { 1, 0, 0, 0} , { 0, 1, 0, 0} , { 0, 0, 1, 0} , { 0, 0, 0, 1} }');
    const cameraMatrix = Matrix4.parse('{ { 0, 1, 0, 0} , { 1, 0, 0, 0} , { 0, 0, 1, 0} , { 0.4100000262260437, 2.779999256134033, -1, 1} }');
    const expected = Matrix4.parse('{{0.,1.,0.,0.},{1.,0.,0.,0.},{0.,0.,1.,0.},{0.41,2.78,-1.,1.}}');
    expect(viewMatrix.multiply(cameraMatrix).isEqual(expected)).to.be.ok;
  });

});