const express 		= require("express"),
	  app 			= express(),
	  bodyParser 	= require("body-parser"),
	  mongoose 		= require("mongoose"),
	  flash 		= require("connect-flash"),
	  passport 		= require("passport"),
	  LocalStrategy = require ("passport-local"),
	  methodOverride= require("method-override"),
	  Campground    = require("./models/campground"),
	  Comment 		= require("./models/comment"),
	  User 			= require("./models/user"),
	  seedDB 		= require("./seeds");


//requiring routes
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

mongoose.connect("mongodb+srv://Devin:1234Abcd@cluster0.4yso0.mongodb.net/<dbname>?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(function(){
	console.log("Connected to DB");
}).catch(function(err){
	console.log("ERROR:", err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();		//seed the database with data


//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Rusty",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//passes currentUser,error,success to every page
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


//using route files
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(3000,process.env.IP, function(){
	console.log("YelpCamp server started!");
});