const _ = require('lodash');
const server = require('../../src/server');
const { User, Player, Match } = require('../../src/models');
const data = require('../util/data');

let token, user;

describe ('Match API',  () => {
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

        const res5 = await chai.request(server)
              .post('/api/players')
              .set('Authorization', `Bearer ${ token }`)
              .send(data.player3);
        player3 = res5.body.player;
        data.match2.player2 = player3.id;
        data.match.winner = player3.id;
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
    });

    /*describe('GET /api/match', () => {
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
    });*/
});
