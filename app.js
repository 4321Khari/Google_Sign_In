const express = require("express");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { connectingToDb } = require("./src/config/mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require("express-session");
const { User } = require("./src/config/mongoose")
var cors = require('cors');
const { google } = require("googleapis");
const app = express();
const port = 5000;

app.use(cors({ origin: true, credentials: true }));

// app.use(
//     cors({
//         origin: "https://localhost:3000",
//         methods: "GET,POST,PUT,DELETE",
//         credentials: true,
//     })
// )

app.use(express.json())

//setup session
app.use(session({
    // milliseconds of a day
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
}));

//setup passport
app.use(passport.initialize());
app.use(passport.session());

//Using Passport
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope:
        ["profile",
            "email",
            "https://www.googleapis.com/auth/fitness.activity.read",
            "https://www.googleapis.com/auth/fitness.body.read"
        ]
},
    async function (accessToken, refreshToken, profile, done) {
        // console.log("profile", profile);
        try {
            let user = await User.findOne({ googleId: profile.id });
            //console.log("user:", user);

            if (!user) {
                user = new User({
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value,
                    accessToken: accessToken
                })
                await user.save();

            }
            return done(null, user)

        } catch (err) {
            return done(err, null)
        }

    }
));
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

//initial google oauth login
app.get("/auth/google", passport.authenticate("google",
    {
        scope:
            ["profile",
                "email",
                "https://www.googleapis.com/auth/fitness.activity.read",
                "https://www.googleapis.com/auth/fitness.body.read"

            ]
    }));

app.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: "http://localhost:3000/dashboard",
    failureRedirect: "http://localhost:3000/login"
}))


app.get("/login/sucess", async (req, res) => {

    if (req.user) {
        res.status(200).json({ message: "user Login", user: req.user })
    } else {
        res.status(400).json({ message: "Not Authorized" })
    }
})

app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err) }
        res.redirect("http://localhost:3000");
    })
})

app.get("/google-fit-data", async (req, res) => {
    if (req.user && req.user.accessToken) {
        try {
            const accessToken = req.user.accessToken;
            console.log("Acces Token :", accessToken)
                
            // Create a Google OAuth2 client using the access token
            const oauth2Client = new google.auth.OAuth2();
            oauth2Client.setCredentials({ access_token: accessToken });

            // Create a Google Fit instance
            const fitness = google.fitness({
                version: 'v1',
                auth: oauth2Client
            });

            // Make a request to the Google Fit API to retrieve fitness data
            const fitnessData = await fitness.users.dataSources.list({
                userId: 'me',
                
            });

            res.status(200).json({ success: true, data: fitnessData });
        } catch (error) {
            console.error('Error fetching Google Fit data:', error);
            res.status(500).json({ error: 'Failed to fetch Google Fit data' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});




app.listen(port, () => {
    console.log("app is listen on 5000");
    connectingToDb;
})

