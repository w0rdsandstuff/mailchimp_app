//jshint esversion: 6
// 1. make new folder, add index.html + app.js
// 2. npm init will create package.json
// 3. npm i express - create package-lock.json + node modules
// 4. nodemon app.js to run app

const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https')

const app = express();

app.use(express.static('public'))  //Provides a path to static files
app.use(bodyParser.urlencoded({extended: true}))  //Allows you to use bodyParser

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
  
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ] 
  }

  const jsonData = JSON.stringify(data);

  const url = 'https://us14.api.mailchimp.com/3.0/lists/eff5f5564b'

  const options = {
    method: 'POST',
    auth: 'lorenzo:793a63fe7ed47eec81ea12f0e4fa913a-us14'
  }

  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  
  request.write(jsonData);   //Comment this line out to test failrue page
  request.end();

});


app.post('/failure', function(req, res) {
  res.redirect('/')
})


app.listen(3000, function () {
  console.log('Server is running on port 3000');
});


//API Key
// 793a63fe7ed47eec81ea12f0e4fa913a-us14

//List Id: eff5f5564b