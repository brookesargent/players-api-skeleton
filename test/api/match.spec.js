const _ = require('lodash');
const server = require('../../src/server');
const { User, Player, Match } = require('../../src/models');
const data = require('../util/data');

let token, user;

describe ('Match API',  () => {
    before(async () => {
        await User.remove({});
        await Player.remove({});

        //create user 1
        const res = await chai.request(server)
          .post('/api/user')
          .send(data.user);
        token = res.body.token;
        user = res.body.user;
        data.player.created_by = user.id;

       //create user 2
       const res2 = await chai.request(server)
          .post('/api/user')
          .send(data.user2);
        token = res.body.token;
        user2 = res.body.user;
        data.player2.created_by = user2.id;

        //create player 1
        const res3 = await chai.request(server)
            .post('/api/player')
            .send(data.player);
        token = res.body.token;
        player = res.body.player;
        data.match.player1 = player.id;

        //create player 2
        const res4 = await chai.request(server)
            .post('/api/player')
            .send(data.player2);
        token = res.body.token;
        player2 = res.body.player2;
        data.match.player2 = player2.id;
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

        //should fail if players aren't able to play against each other
        it('should fail if players cannot play against one another', done => {
            chai.request(server)
              .post('/api/match')
              .send(data.match)
              .set('Authorization', `Bearer ${ token }`)
              .end((err, res) => {
                expect(err).not.to.exist;
                expect(err.status).to.equal(409);
                done();
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
                expect(res.body.player).to.be.a('object');
                done();
              });
          });
    });

    describe('GET /api/match', () => {
        //should fail if token not provided
        //should deliver empty array if no matches
        //should deliver all matches
    });

    describe('GET /api/match/:playerid', () => {
        //should fail if token not provided
        //should fail if player does not exist
        //should deliver wins and losses for player 
        //should fail if wins and losses calculated don't match db
    });

    describe('GET /api/match/rankings', () => {
        //should fail if token not provided
        //should return empty array if no matches exist
        //should deliver a ranked list of every player who has engaged in a match
        //should deliver ranked list correctly calculated
        //should deliver list in order from top ranked to bottom ranked
    });
});
