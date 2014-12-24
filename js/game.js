//Globals
var cardLibrary = [];
var state;
var devMode = false;

//Limit mouseup events
var stupidTimout = 100;
var lastMouseUp = 0;

//Z-index Tracker
var eiffel = 2;

//Server connection
var socket;

//Percentage of Width/HeiWght to snap within (as decimal).
var snappiness = 1/2;

//Run this when the page loads
$( document ).ready( function() {
	//Lock Field
	lockField();

    //Get card list from server
    jsonGetCards();

    //Connect to server
    initConnection();
});

function initDevMode(){
    devMode = true;

    $('#end-turn').text('Draw Card');

    unlockField();

    drawCard(0, 'opponent');
    drawCard(0, 'opponent');
    drawCard(0, 'opponent');

    drawCard(Math.round(Math.random()*2)+14, 'player');
    drawCard(Math.round(Math.random()*2)+14, 'player');
    drawCard(Math.round(Math.random()*2)+14, 'player');
}

function initConnection(){
    //check if offline
    if(getUrlParameter('offline') == 'true'){
        initDevMode();
        return false;
    }

	// connect to the socket
    socket = io('http://74.207.228.248:8080');

    socket.on('draw', function(cardId, target){
    	drawCard(cardId, target)
    });

    socket.on('end_turn', function(data){
    	lockField();
    });

    socket.on('log', function(data){
        console.log(JSON.parse(data));
    });

    socket.on('move', function(cardId, target, owner){
    	playCard(cardId, target.split('-')[1], owner);
    });

    socket.on('start_turn', function(data){
    	unlockField();
    });

    socket.on('connected', function(data){
        //Go ahead and find a match (temp)
        socket.emit('find_match', 'hi');
    });
}

/*
 * Called after jsonGetCards
 */
function initField(){
    initDraggable();

    $('#end-turn').click(function(){
        if(devMode)
            drawCard(Math.round(Math.random()*14), 'player');
        else
    	   socket.emit('end_turn', '');
    });
}

/**
 * Get the array of cards from the database.
 */
function jsonGetCards(){
    $.getJSON( "get_cards.php", function( data ){
        $.each( data, function( key, val ){
            cardLibrary[key] = val;
        });
        initField();
    });
}

/**
 * Borrowed Godsend
 */
function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    alert(out);

    // or, if you wanted to avoid alerts...

    var pre = document.createElement('pre');
    pre.innerHTML = out;
    document.body.appendChild(pre)
}

function getUrlParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
} 

function lockField(){
	$("#end-turn").prop("disabled",true);
}

function unlockField(){
	$("#end-turn").prop("disabled",false);
}

/**
 * Initializs the board objects to draggable states.
 */
function initDraggable(){
    $( '.player.card' ).draggable();	//Set all objects with class 'card' to be draggable

    $( '.player.card' ).mousedown(function(event) {   //Mousedown listener to store card position.
        switch (event.which) {
            //Left Click
            case 1:
                $( this ).addClass('selected-card');
                $( this ).css('z-index', 99999); //Bring card to front.

                updateInspector( $(this) );
                break;
        }
    });


    $( '.player.card' ).mouseup(function(event) {	//Mouseup listener to update card position (snap to slot or reset).
    	//Get timestamp
    	var d = new Date();
    	var ts = d.getTime();
    	if(ts <= lastMouseUp + stupidTimout){ return; }

    	//Update Last Mouseup
		lastMouseUp = ts;

        switch (event.which) {
            //Left Click
            case 1:
            	var cardId = $( this ).attr('name');
            	var parent = $( this ).parent().attr('id');
            	var target = nearestSlotCheck( $(this) );

            	if(parent === target){
                    $( this ).css('left', '0px');
                    $( this ).css('top', '0px');
                    $( this ).removeClass('selected-card');
            	}
            	else{
                    $( this ).remove();

                    if(devMode)
                        playCard(cardId, target.split('-')[1], 'player');
                    else{
                        updateHands();
                        socket.emit('move', cardId, target);
                    }
            	}
                break;
        }

        function nearestSlotCheck(ele){
        	var leftBound = ele.offset().left;
            var upperBound = ele.offset().top;
        	var hCenter = leftBound + ele.width() / 2;
            var vCenter = upperBound + ele.height() / 2;
            var oldParent = ele.parent().attr('id');
        	var newParent = undefined;

        	$( '.cardslot' ).each(function() { //Check the centerpoint of the object on release against acceptable placements.
                var HC = $( this ).offset().left + $( this ).width() / 2;
                var VC = $( this ).offset().top + $( this ).height() / 2;

                if ( Math.abs(HC - hCenter) < ( $( this ).width() * snappiness ) ) {   //Horizontal Check
                    if ( Math.abs(VC - vCenter) < ( $( this ).height() * snappiness ) ) {   //Vertical Check
                        newParent = $( this ).attr('id');
                    }
                }
            });

        	//Use old parent.
        	if(typeof newParent === 'undefined'){ newParent = oldParent; }

            return newParent;
        }
    });
}

/**
 * Updates the width of the player hands.
 */
function updateHands(){
    $( '.game-hand').each(function(){
        var width = 1;

        $( this ).children().each(function(){
            width += $( this ).outerWidth();
        });

        $( this ).css('width', width);
    });
}

/*
 * Creates an element of a given card.
 */
function getCard(cardId, owner, styles){
    if(typeof styles === 'undefined'){ styles = ''; }
	return '<div class="'+owner+' card" name="' + cardId + '" style="background-image:url(img/cards/' + cardId + '.png);'+styles+'"></div>';
}

/**
 * Adds the specified card to the player hand.
 */
function drawCard(cardId, owner){
    $( '#'+owner+'-hand' ).append(getCard(cardId, owner));
    initDraggable();
    updateHands();
}

/*
 * Places a card on a field slot.
 */
function playCard(cardId, target, owner){
    // if(owner === 'opponent'){
    //     $('#opponent-hand').children()[0].remove(); //too easy?
    // }

    if(cardLibrary[cardId]).type === 'Resource'){
        //Find its type (fire, etc.)

        //Build Jquery selector $('#' + ......)
        //and append card to selector.
    }
    else{
        $('#'+owner+'-'+target).append(getCard(cardId, owner));
    }
}

/**
 * Updates the Inspector.
 */
function updateInspector(obj){
    var img = obj.css('background-image');
    var card = cardLibrary[obj.attr('name')];

    $( '#inspector' ).css('background-image', img);
    $( '#selected_name' ).html(card.name);

    //Card HP
    if(card.hp != 0)
		$( '#selected_hp' ).html(card.hp);
    else
		$( '#selected_hp' ).html('');
		
	//Selected Class
    $( '#selected_class' ).html(card.class);

    //Selected Race, Type, Slot
    if(card.type == 'Resource'){
		$( '#selected_race' ).html('');
		$( '#selected_type' ).html(card.type);
		$( '#element_slot' ).html('<img src="./img/icons/' + card.race + '.png">');
    }
    else{
		$( '#selected_race' ).html(card.race);
		$( '#selected_type' ).html(card.type);
		$( '#element_slot' ).html('');
    }

    //Card Gender
    if(card.gender == 'M' || card.gender == 'F')
		$( '#selected_gender' ).html('<img src="./img/icons/'+card.gender+'.png">');
    else
		$( '#selected_gender' ).html('');

    //Selected Weakness
    $( '#selected_weakness' ).html('');
	decodeElement(card.weakness,$( '#selected_weakness' ));

	//Selected Link
    $( '#selected_link' ).html(card.link);

    //Attack 1
    $( '#atk1_name' ).html(card.atk1_name);
	decodeElement(card.atk1_cost,$( '#atk1_cost' ));
    $( '#atk1_desc' ).html(card.atk1_desc);

    //Attack 2
    $( '#atk2_name' ).html(card.atk2_name);
	decodeElement(card.atk2_cost,$( '#atk2_cost' ));
    $( '#atk2_desc' ).html(card.atk2_desc);

    //Attack 3
    $( '#atk3_name' ).html(card.atk3_name);
	decodeElement(card.atk3_cost,$( '#atk3_cost' ));
    $( '#atk3_desc' ).html(card.atk3_desc);
}

/**
 * Converts Element code into pictures.
 */
function decodeElement(string, target){
	target.html(' ');
	if(string === ''){
		return;
	}
	var code = JSON.parse(string);
	for (i=0;i<code.phy;i++){
		target.append('<img src="./img/icons/phy.png" valign="middle">');
	}
	for (i=0;i<code.rng;i++){
		target.append('<img src="./img/icons/rng.png" valign="middle">');
	}
	for (i=0;i<code.fire;i++){
		target.append('<img src="./img/icons/fire.png" valign="middle">');
	}
	for (i=0;i<code.water;i++){
		target.append('<img src="./img/icons/water.png" valign="middle">');
	}
	for (i=0;i<code.earth;i++){
		target.append('<img src="./img/icons/earth.png" valign="middle">');
	}
	for (i=0;i<code.air;i++){
		target.append('<img src="./img/icons/air.png" valign="middle">');
	}
	for (i=0;i<code.light;i++){
		target.append('<img src="./img/icons/light.png" valign="middle">');
	}
	for (i=0;i<code.dark;i++){
		target.append('<img src="./img/icons/dark.png" valign="middle">');
	}
	for (i=0;i<code.cls;i++){
		target.append('<img src="./img/icons/cls.png" valign="middle">');
	}
}