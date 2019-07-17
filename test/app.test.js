const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');

describe('/Apps without query parameters', () => {

  it('/apps without query parameters returns list', () => {
    return request(app)
      .get('/apps')
      .expect(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
      });
  });


});

describe('/Apps with query parameters', () => {
  
  it('returns 400 if genre input is invalid', () => {
    return request(app)
      .get('/apps?genre=notavalidthing')
      .expect(400, 'Genre must be action, puzzle, strategy, casual, arcade, or card');
  });

  it('returns 400 if sort input is invalid', () => {
    return request(app)
      .get('/apps?sort=notavalidthing')
      .expect(400, 'Sort must be rating or app');
  });

  it('returns sorted list if input is valid', () => {
    return request(app)
      .get('/apps?sort=rating')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].Rating <= res.body[i +1].Rating;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('returns alphabetical sorted list if input is valid', () => {
    return request(app)
      .get('/apps?sort=app')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while(sorted && i < res.body.length - 1) {
          sorted = sorted && res.body[i].App <= res.body[i +1].App;
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

  it('returns a filtered list if input is valid', () => {
    return request(app)
      .get('/apps?genre=puzzle')
      .expect(200)
      .expect(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let filtered = true;
        while(filtered && i < res.body.length -1) {
          filtered = filtered && res.body[i].Genres.includes('Puzzle');
          i++;
        }
        expect(filtered).to.be.true;
      });
  });

});