<html lang="en">
<head>
	<link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">
	<script src="//code.jquery.com/jquery-1.10.2.js"></script>
	<script src="//code.jquery.com/ui/1.11.2/jquery-ui.js"></script>
	<script src="https://cdn.socket.io/socket.io-1.2.1.js"></script>
  	<script src="js/game.js"></script>
</head>
<body>
	<div id="main">
		<div id="game">
			<div id="game-field">
				<div class="zonerow">
					<div id="opponent-hand" class="game-hand"></div>
					<div class="handbuffer"></div>
				</div>
				<div class="zonerow">
					<div class="specialzone"></div>
					<div class="zone-container">
						<div id="opponent-resourcezone" class="resourcezone">
							<div id="rested-opponent" class="manaslot"></div>
							<div id="dark-opponent" class="manaslot"></div>
							<div id="light-opponent" class="manaslot"></div>
							<div id="air-opponent" class="manaslot"></div>
							<div id="earth-opponent" class="manaslot"></div>
							<div id="water-opponent" class="manaslot"></div>
							<div id="fire-opponent" class="manaslot"></div>
							<div id="rng-opponent" class="manaslot"></div>
							<div id="phy-opponent" class="manaslot"></div>
						</div>
					</div>
					<div class="specialzone"></div>
				</div>
				<div class="zonerow">
					<div class="specialzone"></div>
					<div class="zone-container">
						<div class="character-zonerow">
							<div id="opponent-slot4" class="characterzone cardslot"></div>
							<div id="opponent-slot3" class="characterzone cardslot"></div>
							<div id="opponent-slot2" class="characterzone cardslot"></div> 
							<div id="opponent-slot1" class="characterzone cardslot"></div>
						</div>
					</div>
				</div>
				<div class="zonerow">
					<div class="specialzone"></div>
					<div id="centerfield"></div>
					<div class="specialzone"></div>
					<div class="zone-container">
						<div class="character-zonerow">
							<div id="player-slot1" class="characterzone cardslot"></div>
							<div id="player-slot2" class="characterzone cardslot"></div>
							<div id="player-slot3" class="characterzone cardslot"></div>
							<div id="player-slot4" class="characterzone cardslot"></div>
						</div>
					</div>
					<div class="specialzone"></div>
				</div>
				<div class="zonerow">
					<div class="specialzone"></div>
					<div class="zone-container">
						<div id="player-resourcezone" class="resourcezone cardslot">
							<div id="phy-player" class="manaslot"></div>
							<div id="rng-player" class="manaslot"></div>
							<div id="fire-player" class="manaslot"></div>
							<div id="water-player" class="manaslot"></div>
							<div id="earth-player" class="manaslot"></div>
							<div id="air-player" class="manaslot"></div>
							<div id="light-player" class="manaslot"></div>
							<div id="dark-player" class="manaslot"></div>
							<div id="rested-player" class="manaslot"></div>
						</div>
					</div>
					<div class="specialzone"></div>
				</div>
				<div class="zonerow">
					<div class="handbuffer"></div>
					<div id="player-hand" class="game-hand"></div>
				</div>
			</div>
			<div id="sidebar">
				<div id="inspector"></div>
				<div id="textArea">
					<table id="cdTable1">
						<tr>
							<th>Name: </th>
							<td id="selected_name"></td> 
						</tr>
						<tr>
							<th>Card Type: </th>
							<td>
								<table>
									<td id="selected_type"></td>
									<td id="element_slot"></td>
								</table>
							</td>
						</tr>
						<tr>
							<th>HP: </th>
							<td id="selected_hp"></td> 
						</tr>
						<tr>
							<th>Class: </th>
							<td id="selected_class"></td> 
						</tr>
						<tr>
							<th>Race: </th>
							<td id="selected_race"></td> 
						</tr>
						<tr>
							<th>Gender: </th>
							<td id="selected_gender"></td> 
						</tr>
						<tr>
							<th>Weakness: </th>
							<td id="selected_weakness"></td> 
						</tr>
						<tr>
							<th>Exclusive to: </th>
							<td id="selected_link"></td> 
						</tr>
					</table>
					<p></p>
					<table id="cdTable2">
						<tr>
							<td>
								<table>
									<th id="atk1_name" class="underlineMe"></th>
									<th id="atk1_cost"></th>
								</table>
							</td>
						</tr>
						<tr>
							<td id="atk1_desc"></td>
						</tr>
						<tr>
							<td>
								<table>
									<th id="atk2_name" class="underlineMe"></th>
									<th id="atk2_cost"></th>
								</table>
						</td>
						</tr>
						<tr>
							<td id="atk2_desc"></td>
						</tr>
						<tr>
							<td>
								<table>
									<th id="atk3_name" class="underlineMe"></th>
									<th id="atk3_cost"></th>
								</table>
							</td>
						</tr>
						<tr>
							<td id="atk3_desc"></td>
						</tr>
					</table>
				</div>
				<div id="sidebar-bottom">
					<button id="end-turn" type="button">End Turn</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>