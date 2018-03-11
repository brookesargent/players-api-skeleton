const _ = require('lodash');
const server = require('../../src/server');
const { User, Player, Match } = require('../../src/models');
const data = require('../util/data');

let token, user, token2, user2, player, player2, player3, player4;

describe('Match API', () => {
  before(async () => {
    await User.remove({});
    const res = await chai.request(server)
      .post('/api/user')
      .send(data.user);
    token = res.body.token;
    user = res.body.user;
    data.player.created_by = user.id;
    data.player3.created_by = user.id;

    const res2 = await chai.request(server)
      .post('/api/user')
      .send(data.user2);
    token2 = res2.body.token;
    user2 = res2.body.user;
    data.player2.created_by = user2.id;

    await Player.remove({});
    const res3 = await chai.request(server)
      .post('/api/players')
      .set('Authorization', `Bearer ${ token }`)
      .send(data.player);
    player = res3.body.player;
    data.match.player1 = player.id;
    data.match2.player1 = player.id;
    data.match.winner = player.id;

    const res4 = await chai.request(server)
      .post('/api/players')
      .set('Authorization', `Bearer ${ token2 }`)
      .send(data.player2);
    player2 = res4.body.player;
    data.match.player2 = player2.id;
    data.match3.player1 = player2.id;

    const res5 = await chai.request(server)
      .post('/api/players')
      .set('Authorization', `Bearer ${ token }`)
      .send(data.player3);
    player3 = res5.body.player;
    data.match2.player2 = player3.id;
    data.match2.winner = player3.id;

    const res6 = await chai.request(server)
      .post('/api/players')
      .set('Authorization', `Bearer ${ token }`)
      .send(data.player4);
    player4 = res6.body.player;
    data.match3.player2 = player4.id;
    data.match3.winner = player4.id;
  });

  describe('POST /api/match', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    //should fail if token not provided
    it('should fail if token not provided', done => {
      chai.request(server)
        .post('/api/match')
        .send(data.match)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    //should fail if required fields are not present
    ['player1', 'player2', 'player1_score', 'player2_score', 'winner'].forEach(field => {
      it(`should fail if ${ field } not present`, done => {
        chai.request(server)
          .post('/api/match')
          .send(_.omit(data.match, field))
          .set('Authorization', `Bearer ${ token }`)
          .end(err => {
            expect(err).to.exist;
            expect(err.status).to.equal(409);
            done();
          });
      });
    });

    //should succeed and show match data if created
    it('should deliver match if successful', done => {
      chai.request(server)
        .post('/api/match')
        .send(data.match)
        .set('Authorization', `Bearer ${ token }`)
        .end((err, res) => {
          expect(err).not.to.exist;
          expect(res.status).to.equal(201);
          expect(res.body).to.be.a('object');
          expect(res.body.success).to.be.true;
          expect(res.body.match).to.be.a('object');
          done();
        });
    });

    //should fail if players aren't able to play against each other
    it('should fail if players owned by same user', done => {
      chai.request(server)
        .post('/api/match')
        .send(data.match2)
        .set('Authorization', `Bearer ${ token }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(409);
          done();
        });
    });

    //should update winner rating based on match scores
    it('should update winner rating based on scores', async () => {
      let res, error, player;
      try {
        res = await chai.request(server)
          .post('/api/match')
          .send(data.match3)
          .set('Authorization', `Bearer ${ token }`);

        player = await Player.findById(data.match3.winner);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(201);
      expect(player.rating).to.equal(8029);
    });
  });

  describe('GET /api/match', () => {
    beforeEach(async () => {
      await Match.remove({});
    });
    //should fail if token not provided
    it('should fail if token not provided', done => {
      chai.request(server)
        .get('/api/match')
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    //should deliver empty array if no matches
    it('should deliver an empty array if no matches', async () => {
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/match')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }
      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.matches).to.exist;
      expect(res.body.matches).to.be.a('array');
      expect(res.body.matches.length).to.equal(0);
    });

    //should deliver all matches
    it('should deliver all matches', async () => {
      await Match.create(data.match);

      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/match')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.matches).to.be.a('array');
      expect(res.body.matches.length).to.equal(1);

      res.body.matches.forEach(match => expect(match.id).to.be.a('string'));
    });


  });

  describe('GET /api/match/:playerid', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    //should fail if token not provided
    it('should fail if token not provided', done => {
      chai.request(server)
        .get(`/api/match/${ player.id }`)
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    //should fail if player does not exist
    it('should fail if player does not exist', async () => {
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/match/1')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(res).not.to.exist;
      expect(error.status).to.equal(404);
    });

    //should deliver correct count of wins and losses for player
    it('should deliver wins and losses for player', async () => {
      await Match.create(data.match);

      let res, error;
      try {
        res = await chai.request(server)
          .get(`/api/match/${ player.id }`)
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }

      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.wins).to.be.a('number');
      expect(res.body.losses).to.be.a('number');
      expect(res.body.wins).to.equal(1);
      expect(res.body.losses).to.equal(0);
    });
  });

  describe('GET /api/match/rankings', () => {
    beforeEach(async () => {
      await Match.remove({});
    });

    //should fail if token not provided
    it('should fail if token not provided', done => {
      chai.request(server)
        .get('/api/match/rankings')
        .end(err => {
          expect(err).to.exist;
          expect(err.status).to.equal(403);
          done();
        });
    });

    //should return empty array if no matches exist
    it('should deliver an empty array if no matches', async () => {
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/match/rankings')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }
      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.rankings).to.exist;
      expect(res.body.rankings).to.be.a('array');
      expect(res.body.rankings.length).to.equal(0);
    });

    //should fail if a player who hasn't engaged in a match is ranked
    it('should not rank players who have not played a match', async () => {
      await Match.create(data.match);
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/match/rankings')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }
      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.success).to.be.true;
      expect(res.body.rankings).to.exist;
      expect(res.body.rankings).to.be.a('array');
      expect(res.body.rankings.length).to.equal(2);
    });

    //should deliver list with correct percentages in order from top ranked to bottom ranked
    it('should deliver rankings in correct order', async () => {
      await Match.create(data.match);
      let res, error;
      try {
        res = await chai.request(server)
          .get('/api/match/rankings')
          .set('Authorization', `Bearer ${ token }`);
      } catch (err) {
        error = err;
      }
      expect(error).not.to.exist;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.a('object');
      expect(res.body.rankings).to.exist;
      expect(res.body.rankings).to.be.a('array');
      expect(res.body.rankings[0].winPercentage).to.equal(100);
      expect(res.body.rankings[1].winPercentage).to.equal(0);
    });
  });
});
