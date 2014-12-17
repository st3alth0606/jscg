// Main Server File
var eiffel = 0;
var port = 8080
var cardLibrary = [];
var playerList = [];
var matches = [];
var express = require('express'),
	app = express();
	io = require('socket.io').listen(app.listen(port));

console.log('Jscg is running on http://localhost:' + port);
// jsonGetCards();

// Initialize a new socket.io application, named 'chat'
var chat = io.on('connection', function(socket){
	playerList[socket.id] = socket;

	//Player drew a card
	socket.on('move', function(cardId, target){
		target = target.split('-')[1];

		if(validMove(socket, cardId, target)){
			matches[socket.match].players.forEach(function(player){
				var owner = 'player';

				if(player !== socket.id)
					owner = 'opponent';

				playerList[player].emit('move', cardId, target, owner);
			});
		}else{
			socket.emit('draw', cardId, 'player');
		}
	});

	//Player is looking for a match
	socket.on('find_match', function(data){
		console.log(socket.id + ' is looking for a match.');
		findMatch(socket);
	});

	socket.on('end_turn', function(data){
		var match = matches[socket.match];
		if(match.players[match.playerTurn] !== socket.id){ return; } //Throw away irrelevant end_turn events.

		//End turn
		socket.emit('end_turn', '');

		//Switch active player
		match.playerTurn = 1 - match.playerTurn;

		//Start turn
		playerList[match.players[match.playerTurn]].emit('start_turn', '');

		//Draw card
		drawCard(socket.match, match.playerTurn);
	});

	//Player has lost connection to the server
	socket.on('disconnect', function(data){

	});

	socket.emit('connected', '');
});

/**
 * Get the array of cards from the database.
 */
function jsonGetCards(){ //FIXME NO JQUERY
	console.log('Attempting to load card library.');
    $.getJSON( "get_cards.php", function( data ){
        $.each( data, function( key, val ){
            cardLibrary[key] = val;
        });
    });
}

/*
 * Attempts to find a match for the player (socket)
 * If a match isn't found creates a new one.
 */
function findMatch(socket){
	var match;
	var foundMatch = false;

	matches.some(function(aMatch){
		//Existing Match
		if(aMatch.players.length < 2){
			match = aMatch;
			foundMatch = true;
			return true;
		}
	});

	//New Match
	if(foundMatch === false){
		match = getNewMatch();
		matches[match.id] = match;
	}

	match.players.push(socket.id);
	playerList[socket.id].match = match.id;
	socket.emit('log', JSON.stringify('Match Found! '+match.id));
	if(foundMatch){
		startMatch(match.id);
	}
}

/*
 * Begins a match
 */
function startMatch(id){
	var match = matches[id];

	match.playerTurn = Math.round(Math.random());

	match.players.forEach(function(player){
		playerList[player].emit('log', JSON.stringify('Starting the Match'));
	});

	//Starting Hands
	drawCard(id, 0);
	drawCard(id, 0);
	drawCard(id, 0);
	drawCard(id, 1);
	drawCard(id, 1);
	drawCard(id, 1);

	playerList[match.players[match.playerTurn]].emit('start_turn', '');
}

/*
 * Draws a card for the given player, emits message to all players
 */
function drawCard(matchId, playerIndex){
	if(playerIndex !== 0 && playerIndex !== 1)	//Throw away invalid requests
		return false;
	
	var player = matches[matchId].players[playerIndex];

	matches[matchId].players.forEach(function(p){
		var owner = 'opponent';
		var cardId = 0;
		if(p === player){
			owner = 'player';
			cardId = getTopCard();
		}
		playerList[p].emit('draw', cardId, owner);
	});
}

/*
 * Returns true if the method is allowed, false otherwise
 */
function validMove(player, cardId, target){
	var match = matches[player.match];

	if(match.players[match.playerTurn] !== player.id) //If it's not the given player's turn
		return false;

	//I will eventually hate myself for this method
	return true;
}

/*
 * Will one day return the top card of the deck
 */
function getTopCard(){
	return Math.round(Math.random()*2)+14;
}

/*
 * Returns a new empty match object
 */
function getNewMatch(){
	var match = {};

	match.id = eiffel++;
	match.players = [];
	match.field = {};
	match.field.a = {
		'deck': [],
		'hand': [],
		'slot1': [],
		'slot2': [],
		'slot3': [],
		'slot4': []
	};
	match.field.b = {
		'deck': [],
		'hand': [],
		'slot1': [],
		'slot2': [],
		'slot3': [],
		'slot4': []
	};

	return match;
}

// Server wide message
function serverMsg(type, msg){
	// playerList.forEach(function(val){
	Object.keys(playerList).forEach(function(key){
		console.log('[SvMsg]: ' + msg);
		playerList[key].emit(type, msg);
	});
}