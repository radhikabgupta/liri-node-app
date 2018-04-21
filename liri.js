require("dotenv").config();

var KeysObject = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var Request = require("request");
var fs = require("fs");

var twitterKeys = KeysObject.twitterKeys;
var command = process.argv[2];
var commandArgument = process.argv[3];

switch (command) {
  case "my-tweets":
    console.log("calling myTweets()");
    myTweets();
    break;

  case "spotify-this-song":
    mySpotify(commandArgument);
    break;

  case "movie-this":
    movieThis(commandArgument);
    break;

  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    console.log("Command not Valid. Please try again!");
}

// if the my-tweets command is received
function myTweets() {
  var client = new Twitter(KeysObject.twitter);

  var params = {
    screen_name: "@rgupta5610",
    count: 20,
    trim_user: false,
    exclude_replies: true,
    include_rts: false
  };

  client.get("statuses/user_timeline", params, function(
    error,
    tweets,
    response
  ) {
    if (!error) {
      // Loops through tweets and prints out tweet text and creation date.
      for (var i = 0; i < tweets.length; i++) {
        logThis(tweets[i].created_at);
        logThis(tweets[i].text);
      }
    } else {
      console.log(error);
    }
  });
}

// if the spotify-this-song command is received
function mySpotify(receivedSong) {

    var spotify = new Spotify(KeysObject.spotify);

    var mySong = receivedSong ? receivedSong : 'The Sign Ace of Base';
    
    spotify.search({ type: 'track', query: mySong }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      //console.log(data); 
      
      logCommand();

      logThis('Artist Name: ' + data.tracks.items[0].artists[0].name);
      logThis('Song Name: ' + data.tracks.items[0].name);
      logThis('Preview Link: ' + data.tracks.items[0].preview_url);
      logThis('Album Title: ' + data.tracks.items[0].album.name);

      });
}

function movieThis(receivedMovie) {
  var request = require("request");
  var myMovie = receivedMovie ? receivedMovie : "Mr. Nobody";
  var queryUrl =
    "http://www.omdbapi.com/?t=" +
    myMovie +
    "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      logCommand();

      logThis("Movie Title: " + JSON.parse(body).Title);
      logThis("Release Year: " + JSON.parse(body).Year);
      logThis("IMDB Rating: " + JSON.parse(body).imdbRating);
      logThis("Production Country: " + JSON.parse(body).Country);
      logThis("Language: " + JSON.parse(body).Language);
      logThis("Plot: " + JSON.parse(body).Plot);
      logThis("Actors/Actresses: " + JSON.parse(body).Actors);
      logThis("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
      logThis("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
    }
  });
}

// if the do-what-it-says command is received
function doWhatItSays() {

	fs.readFile('random.txt', 'utf8', function(error, data) {
    if (error) return console.log('Filesystem Read Error: ' + error);
    var dataObject = data.split(',');
    var myFunction = dataObject[0];
    var myArgument = dataObject[1];
  
    switch (myFunction) {
      case 'my-tweets':
        myFunction = 'myTweets';
        break;
      case 'spotify-this-song':
        myFunction = 'mySpotify';
        break;
      case 'movie-this':
        myFunction = 'movieThis';
        break;
      default:
        console.log('Unexpected error in doWhatItSays function');
    }
  
    eval(myFunction)(myArgument);
    });
  }
  
  // logging function
  function logThis(dataToLog) {
  
    // log the data to console
    console.log(dataToLog);
  
    // also append it to log.txt followed by new line escape
    fs.appendFile('log.txt', dataToLog + '\n', function(err) {
      
      // if there is an error log that then end function
      if (err) return console.log('Error logging data to file: ' + err);
    
    // end the appendFile function
    });
  
  // end the logThis function
  }
  
  // logging command to log.txt file function
  function logCommand() {
  
    // structure the string that equates to the command that was issued
    if (commandArgument) {
      var tempString = "COMMAND: node liri.js " + command + " '" + commandArgument + "'";
    } else {
      var tempString = "COMMAND: node liri.js " + command;
    }
  
    // append the command to log.txt followed by new line escape
    fs.appendFile('log.txt', tempString + '\n', function(err) {
      
      // if there is an error log that then end function
      if (err) return console.log('Error logging command to file: ' + err);
    
    // end the appendFile function
    });
  
  // end the logCommand function

}

function logThis(dataToLog) {
  console.log(dataToLog);
  fs.appendFile("log.txt", dataToLog + "\n", function(err) {
    if (err) return console.log("Error logging data to file: " + err);
  });
}

function logCommand() {
  if (commandArgument) {
    var tempString =
      "COMMAND: node liri.js " + command + " '" + commandArgument + "'";
  } else {
    var tempString = "COMMAND: node liri.js " + command;
  }

  fs.appendFile("log.txt", tempString + "\n", function(err) {
    if (err) return console.log("Error logging command to file: " + err);
  });
}
