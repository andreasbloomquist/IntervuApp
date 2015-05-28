//Back-End Server, requires, routes
var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	_ = require("underscore"),
	path = require("path"),
	db = require("./models"),
	session = require("express-session"),
	bcrypt = require("bcrypt");

//use app for routes
var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname, '/public'));

app.use(session({
  secret: 'Spencer secret',
  resave: false,
  saveUninitialized: true
}))

// DATA
var albums = [
	{ id: 0, albumPic: "../public/images/take_care.jpg", artist: "Drake", albumName: "Take Care"},
	{ id: 1, albumPic: "../public/images/dark_fantasy.jpg", artist: "Kanye West", albumName: "My Beautiful Dark Twisted Fantasy"},
	{ id: 2, albumPic: "../public/images/ready_to_die.jpg", artist: "Notorious B.I.G", albumName: "Ready To Die"},
]


// first video is Take Care
var interviews = [
	{ id: 0, album: "Take Care", video: "https://www.youtube.com/embed/twNV2ItVBcY"},
	{ id: 0, album: "Take Care", video: "https://www.youtube.com/embed/LPG3pBOcrMs"},
	{ id: 1, video: "https://www.youtube.com/embed/VSllPXm2Eao"},
	{ id: 1, video: "https://www.youtube.com/embed/oqHxvAcE13k"},
	{ id: 2, video: "https://www.youtube.com/embed/Cjt029chOvA"},
	{ id: 2, video: "https://www.youtube.com/embed/Lv8PdI477ks"}
]

var loginHelpers = function (req, res, next) {

  req.login = function (user) {
    req.session.userId = user._id;
    req.user = user;
    return user;
  };

  req.logout = function () {
    req.session.userId = null;
    req.user = null;
  };

  req.currentUser = function (cb) {
    var userId = req.session.userId;
    db.User.
      findOne({
        _id: userId
      }, cb);
  };

  // careful to have this
  next(); // real important
};

app.use("/", loginHelpers)

var views = path.join(__dirname, "views");	

app.get("/", function (req, res) {
	var homePath = path.join(views, "home.html");
	res.sendFile(homePath);
});

app.get("/signup", function (req, res) {
	var signupPath = path.join(views, "signup.html");
	res.sendFile(signupPath);
});

app.post("/signup", function (req, res) {
	var newUser = req.body.user
	  db.User.createSecure(newUser.email, newUser.password, function (err, user) {
	    if (user) {
	      req.login(user);
	      res.redirect("/activities");
	    } else {
	      res.redirect("/signup");
	    }
	  });
	req.currentUser();  
});

app.get("/login", function (req, res) {
	var loginPath = path.join(views, "login.html");
	res.sendFile(loginPath);
});

app.post("/login", function (req, res) {
	var user = req.body.user;

  db.User.authenticate(user.email, user.password, function (err, user) {
    if (!err) {
      req.login(user);
      res.redirect("/activities");	
    } else {
      res.redirect("/login");
    }
  })
});

app.get("/activities", function (req, res) {
	var activitiesPath = path.join(views, "activities.html");
	res.sendFile(activitiesPath);
});

app.get("/albums", function (req, res) {
	res.send(JSON.stringify(albums));
})

//keep getting the error here i believe
app.get("/activities/:id", function (req, res) {
	res.send(interviews);
})

app.get("/contactme", function (req, res) {
	var contactPath = path.join(views, "contactMe.html");
	res.sendFile(contactPath);
});

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
})

app.get("/albums", function (req, res) {
	res.send(JSON.stringify(albums));
})

app.get("/search/:album", function (req, res) {
	res.send(interviews[0]);
})

app.listen(process.env.PORT || 3000, function () {
	console.log("running");
})

























