require('./spec_helper');

describe("Lobby", function(){
  var lobby = new Lobby();

  beforeEach(function (){
    return lobby.clearLobby();
  });

  describe("createGame", function(){
    it("creates a game with the provided data", function(){

      var player = new Player({ id: generateRandomId() });
      var data = {
        id    : player.id,
        type  : 'private',
        owner : player
      };

      expect(lobby.findGamesByType(data.type).length).to.eq(0);

      var game = lobby.createGame(data);

      expect(game.id).to.eq(player.id);
      expect(game.owner.id).to.eq(player.id);

      expect(lobby.findGamesByType(data.type).length).to.eq(1);
      expect(lobby.findGamesByType(data.type)[0].id).to.eq(game.id);
      expect(lobby.findGameById(data.id).id).to.eq(game.id);
    });

    context("when data[type] is not provided", function(){
      it("throws an error", function(){
        var player = new Player({ id: generateRandomId() });
        var data = {
          id    : player.id,
          type  : null,
          owner : player
        };

        (function(){
          var game = lobby.createGame(data);
        }).should.throw("data[type] must be specified!")
      });
    });

    context("when data[type] is invalid", function(){
      it("throws an error", function(){
        var player = new Player({ id: generateRandomId() });
        var data = {
          id    : player.id,
          type  : 'invalid',
          owner : player
        };

        (function(){
          var game = lobby.createGame(data);
        }).should.throw("Game Type invalid is invalid!");
      });
    });

    context("when data[id] is not provided", function(){
      it("throws an error", function(){
        var player = new Player({ id: generateRandomId() });
        var data = {
          id    : null,
          type  : 'private',
          owner : player
        };

        (function(){
          var game = lobby.createGame(data);
        }).should.throw("data[id] must be provided!");
      });
    });

    context("when data[owner] is not provided", function(){
      it("throws an error", function(){
        var data = {
          id    : 'something',
          type  : 'private',
          owner : null
        };

        (function(){
          var game = lobby.createGame(data);
        }).should.throw("data[owner] must be provided!");
      });
    });
  });

  describe("ejectPlayerFromCurrentGame", function(){
    var player = new Player({ id: generateRandomId() });
    var data = {
      id    : player.id,
      type  : 'private',
      owner : player
    };

    context("when the game has only one player", function(){
      it("destroys the game", function(){
        var game = lobby.createGame(data);
        lobby.ejectPlayerFromCurrentGame(player);

        expect(lobby.findGameById(game.id)).to.eq(undefined);
        expect(_.map(lobby.allGames(), function(game){ return game.id; }).indexOf(game.id)).to.equal(-1);
      });

      it("returns null", function (){
        var game         = lobby.createGame(data);
        var returnedGame = lobby.ejectPlayerFromCurrentGame(player);

        expect(returnedGame).to.eql(null);
      });

    });

    context("when the game has more than one player", function(){

      it("does not destroy the game", function(){
        var game = lobby.createGame(data);
        var player2 = new Player({ id: generateRandomId() });

        game.usherPlayer(player2);
        expect(game.numOfPlayers()).to.eq(2);

        lobby.ejectPlayerFromCurrentGame(player);
        expect(lobby.findGameById(game.id)).not.to.eq(undefined);
      });

      it("returns the game the player returned from", function (){
        var game         = lobby.createGame(data);
        var player2 = new Player({ id: generateRandomId() });

        game.usherPlayer(player2);
        expect(game.numOfPlayers()).to.eq(2);

        var returnedGame = lobby.ejectPlayerFromCurrentGame(player);

        expect(returnedGame.id).to.eq(game.id);
      });
    });
  });

  describe("destroyGame", function(){
    var player = new Player({ id: generateRandomId() });
    var data = {
      id    : player.id,
      type  : 'private',
      owner : player
    };
    var game = lobby.createGame(data);

    it("destroy the given game", function(){
      lobby.destroyGame(game);

      expect(lobby.findGameById(game.id)).to.eq(undefined);
    });
  });
});