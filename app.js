  var firebaseConfig = {
    apiKey: "AIzaSyBrYu-J-n3vLwaBfuRBaMmLlPhA19P5pxw",
    authDomain: "train-schedule-bootcamp.firebaseapp.com",
    databaseURL: "https://train-schedule-bootcamp.firebaseio.com",
    projectId: "train-schedule-bootcamp",
    storageBucket: "",
    messagingSenderId: "477307186015",
    appId: "1:477307186015:web:847b3c0b886ca72c"
  };
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

$("#add").on("click", function () {
  event.preventDefault();

  // Get the input values
  var trainName = $('#trainName').val().trim();
  var destination = $('#destination').val().trim();
  var firstTrain = $('#firstTrain').val().trim();
  var rate = $('#rate').val().trim();

  // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainTime = moment(firstTrain, "hh:mm").subtract(1, "years");
    console.log(firstTrainTime);

    // Current Time
    var timenow = moment();
    console.log("CURRENT TIME: " + moment(timenow).format("hh:mm"));

    // Difference between the times
    var timedifferece = moment().diff(moment(firstTrainTime), "minutes");
    console.log("DIFFERENCE IN TIME: " + timedifferece);

    // Time apart (remainder)
    var timeapart = timedifferece % rate;
    console.log(timeapart);

    // Minute Until Train
    var minsAway = rate - timeapart;
    console.log("MINUTES TILL TRAIN: " + minsAway);

    // Next Train
    var nextTrain = moment().add(minsAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  database.ref().push({
    train: trainName,
    destination: destination,
    firsttrain: nextTrain,
    rate: rate,
    away: minsAway
  });
});

var labelText = {
  "train": "Train Name",
  "destination": "Destination",
  "rate": "Frequency",
  "firstTrain": "Next Train",
  "away": "Mins Away",
};

function rendertrain(table, train) {

  var labels = $("<tr>");
  var data = $("<tr>");

  for (item in labelText) {
    data.append($("<td>").text(train[item]));
  };
  table.append(labels);
  table.append(data);

};

var trainData;

database.ref().on("value", function (snapshot) {
  console.log(snapshot.val());

  var trainTable = $("#trains");
  trainTable.empty();
  trainData = snapshot.val();
 
  var label = $("<tr>");

  for (key in labelText) {
    label.append($("<td>").append($("<strong>").text(labelText[key])));}
  $("#trains").append(label);
  for (item in trainData) {
    rendertrain(trainTable, trainData[item]);
  }
  // If there is an error that Firebase runs into -- it will be stored in the "errorObject"
  // Again we could have named errorObject anything we wanted.
}, function (errorObject) {
  // In case of error this will print the error
  console.log("The read failed: " + errorObject.code);
});


