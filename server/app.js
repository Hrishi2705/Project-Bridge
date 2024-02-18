require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db/conn")
const PORT = 8000;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth20").Strategy;
const userdb = require("./model/userSchema")

const clientid = "349131111223-051qe5l8u963f6pk1260l89qk7f0tue2.apps.googleusercontent.com";
const clientsecret = "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";

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));
app.use(express.json());

// setup session
app.use(session({
    secret: "8642957315",
    resave: false,
    saveUninitialized: true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());
// server/app.js

passport.use(
    new OAuth2Strategy({
            clientID: clientid,
            clientSecret: clientsecret,
            callbackURL: "/auth/google/callback", // Remove the function
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userdb.findOne({
                    googleId: profile.id
                });

                if (!user) {
                    let user_type = profile.emails[0].value.includes('@hyderabad.bits-pilani.ac.in') ?
                        profile.emails[0].value.startsWith('f') ? 'student' : 'other' : 'teacher';
                        // profile.emails[0].value.startsWith('f') ? 'student' : 'teacher' : 'other'; (Actual code while deploying)
                    user = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value,
                        user_type: user_type
                    });
                    console.log("Usertype test 1", user_type);
                    await user.save();
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);



passport.serializeUser((user, done) => {
    done(null, user);
})

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Backend app.js
// initial google ouath login
app.get("/auth/google", (req, res, next) => {
    const userType = req.query.user_type;
    const authURL = `/auth/google/callback`;
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: userType // Pass userType as state parameter
    })(req, res, next);
});

// Google OAuth callback route
// Google OAuth callback route
app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", {
        failureRedirect: "http://localhost:3000/login"
    })(req, res, next);
}, (req, res) => {
    console.log("Authenticated successfully");
    console.log("Query parameters:", req.query); // Log the entire query object
    const userType = req.query.state; // Retrieve userType from state parameter
    console.log("Usertype test 2", userType);

    const userEmail = req.user.email;
    let expectedRole = '';

    if (userEmail.includes('@hyderabad.bits-pilani.ac.in')) {
        if (userEmail.startsWith('f')) {
            expectedRole = 'student';
        } else {
            expectedRole = 'other';
            // expectedRole = 'teacher';(Final code while deploying)
        }
    } else{
        expectedRole = 'teacher';
        // expectedRole = 'other';(Final code while deploying)
    }
    

    if (expectedRole !== userType) {
        res.redirect("http://localhost:3000/error"); // Redirect to error page if roles mismatch
        return;
    }

    if (userType === 'teacher') {
        res.redirect("http://localhost:3000/TeacherHome");
    } else if (userType === 'student') {
        res.redirect("http://localhost:3000/StudentHome");
    } else {
        res.redirect("http://localhost:3000/login");
    }
});





app.get("/login/success", async (req, res) => {
    console.log("Login success route hit");
    if (req.user) {
        console.log("User authenticated:", req.user);
        res.status(200).json({
            message: "user Login",
            user: req.user
        });
    } else {
        console.log("User not authenticated");
        res.status(400).json({
            message: "Not Authorized"
        });
    }
});

app.get("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        res.redirect("http://localhost:3000/login");
    })
})

app.listen(PORT, () => {
    console.log(`server start at port no ${PORT}`)
})