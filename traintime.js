// Steps to complete:

// 1. Create Firebase link
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the trainlist.
// 5. Create a way to calculate the time way. Using difference between start and current time.
//    Then take the difference and modulus by frequency. (This step can be completed in either 3 or 4)

const config = {
    apiKey: "AIzaSyBYTj2TqiIsowUXwtnP1AVlbiEN_WyhC-s",
    authDomain: "trains-a4274.firebaseapp.com",
    databaseURL: "https://trains-a4274.firebaseio.com/",
    storageBucket: "trains-a4274.appspot.com"
};

firebase.initializeApp(config);

const data = firebase.database();

const trainBtn = document.getElementById('add-train-btn');

 const addTrainData = () => {
    let trainName = document.getElementById('train-name-input').val();
    let destination = document.getElementById('destination-input').val();
    let freq = document.getElementById('frequency-input').val();

    let newTrain = {
        name: trainName,
        dest: destination,
        freq: freq
    };

    data.ref().push(newTrain).then(function(err, res){
        if (err){
            console.log(err);
        } else {
            console.log(res);
            // noinspection JSAnnotator
            trainName.val() = '';
            destination.val = '';
            freq.val = '';
        }
    });
    console.log([newTrain]);
};

data.ref().on('child_added', (childSnapshot, prevChildKey)=>{
    console.log(childSnapshot.val());

    const tName = childSnapshot.val().name;
    const tDestination = childSnapshot.val().destination;
    const tFrequency = childSnapshot.val().frequency;
    const tFirstTrain = "10:00";
    const timeArr = tFirstTrain.split(":");
    const trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
    const maxMoment = moment.max(moment(), trainTime);

    let tMinutes;
    let tArrival;


    if (maxMoment === trainTime) {
        ltArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // Calculate the minutes until arrival using hardcore math
        // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
        // and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        // To calculate the arrival time, add the tMinutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }

    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" +
        tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});
