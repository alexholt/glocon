const expect = require('chai').expect;

import Rect from '../src/client/rect.js';
import Territory from '../src/client/territory.js';

global.Path2D = () => {};

describe('A Territory', () => {

  describe('should provide a bounding box', () => {

    it('that is a Rect object', () => {
      const subject = new Territory('');
      expect(subject.getBoundingBox()).to.be.instanceof(Rect);
    });

    it('for a simple rectangle', () => {
      const subject = new Territory('m 10 10 h 100 v 100 h -100 z');
      expect(subject.getBoundingBox()).to.have.property('x', 10);
      expect(subject.getBoundingBox()).to.have.property('y', 10);
      expect(subject.getBoundingBox()).to.have.property('x2', 110);
      expect(subject.getBoundingBox()).to.have.property('y2', 110);
    });

    it('for another simple rectangle', () => {
      const subject = new Territory('m 10 10 m 110 100 m 110 110 m 100 110 z');
      expect(subject.getBoundingBox()).to.have.property('x', 10);
      expect(subject.getBoundingBox()).to.have.property('y', 10);
      expect(subject.getBoundingBox()).to.have.property('x2', 330);
      expect(subject.getBoundingBox()).to.have.property('y2', 330);
    });

    it('for a simple rectangle with commas', () => {
      const subject = new Territory('m 10,10 100,0 0,100 -100,0 z');
      expect(subject.getBoundingBox()).to.have.property('x', 10);
      expect(subject.getBoundingBox()).to.have.property('y', 10);
      expect(subject.getBoundingBox()).to.have.property('x2', 110);
      expect(subject.getBoundingBox()).to.have.property('y2', 110);
    });

  });

  describe("should provide it's own centroid", () => {

    it('for a simple square', () => {
      const subject = new Territory('m 0,0 10,0 0,10 -10,0 z');
      expect(subject.getCentroid()).to.eql({x: 5, y: 5});
    });

  });

});
