<?php

$servername = "74.207.228.248";
$username = "jscg";
$password = "pqR3WzERpMpyNCp8";
$dbname = "jscg";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

$sql = "SELECT * FROM cards";
$result = $conn->query($sql);
$stack = array();

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()){
    	array_push($stack, $row);
    }
}

echo json_encode($stack);

$conn->close();

?>