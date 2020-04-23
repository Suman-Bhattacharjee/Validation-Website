//jshint esversion:6

// express is for using app and express module in nodejs
const express = require("express");
// bodyParser is used for taking the input from the form body
const bodyParser = require("body-parser");
// ejs is used for creating dynamic page
const ejs = require("ejs");
// getAge used to canculate the age by the given input date and the present date
var getAge = require('get-age');
// validatePhoneNumber is used to validate a phone number
const validatePhoneNumber = require('validate-phone-number-node-js');
// favicon and path is used for the favicon icon for the webpage
var favicon = require('serve-favicon');
var path = require('path');

// startings contents which will be used when those dymanip page are created
const homeStartingContent = "Welcome to the Simple Form Validation Website";
const aboutContent = "It's a simple form validation website where we take the user input as name, date of birth, email and phone number. Then we can simply checking if those details are valid or not by using simple criteria and if the details are valid then the user is simply registered and his details showing in a shaperate page,otherwise not. Here HTML, CSS, Bootstrap are used for making frontend and NodeJS, Express and EJS are used for developing the backend. All data are stored in a array and then displayed into the result page when a used added successfully.";

// creating app
const app = express();

// use the favicon to show in the web page
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// set ejs into view folder
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
// set express to the public folder to use the css file publicly
app.use(express.static("public"));

// initilize the blank array to store verified data as input
let formArr = [];

// when the '/' is called then it render the homepage with the ejs template value
app.get("/", function(req, res) {
  res.render("home", {
    startingContent: homeStartingContent,
  });
});

// when the '/about' is called then it render the aboutpage with the ejs template value
app.get("/about", function(req, res) {
  res.render("about", {
    aboutPage: aboutContent
  });
});

// when the '/contact' is called then it render the contactpage with the ejs template value
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactPageName: "Suman Bhattacharjee",
    contactPageEmail: "suman.uemk@gmail.com"
  });
});

// when the '/result' is called then it render the resultpage with the ejs template array value where we can showing the verified result data
app.get("/result", function(req, res){
  res.render("result",{ startingResult: "All Data Verified User(s)", posts: formArr });
});

// when the '/user-form' is called then it render the userForm page to get the form value
app.get("/user-form", function(req, res) {
  res.render("userForm", { message: " " });
});

// when we press the submit button in the userForm page the the post method is called and then it sends the data to the server to verify the details
app.post("/user-form", function(req, res) {
  // calculate the age from the given date and the present date
  var age = getAge(req.body.age);
  // validate the phone number
  const numberResult = validatePhoneNumber.validate(req.body.phno);

  if(age >= 18 && numberResult){
    // if all the details are verified then we take the data from the form body and save into an array element
    const form = {
      name: req.body.name,
      dob: req.body.age,
      email: req.body.email,
      phno: req.body.phno
    }
    // push the array element into the array to store
    formArr.push(form);
    // if all the details are verified then the user is registered into array and in result page all the details are showing
    res.redirect("/result");
  }
  // if any error occur or the data are not valid then this part will execute and sends an error message to the user
  else{
    if(!numberResult && age < 18){
      res.render("userForm", { message: " Age cannot be less than 18 years and Phone number not valid" });
    }
    else{
      if(age < 18){
        res.render("userForm", { message: " Age cannot be less than 18 years" });
      }
      else{
        res.render("userForm", { message: " Phone number not valid" });
      }
    }
  }

});




let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, function() {
  console.log("Server started");
});
