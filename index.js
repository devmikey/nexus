const dotenv = require('dotenv');
const express = require('express');
var cookieParser = require('cookie-parser');
const stencil = require('@stencil/core/server');
const cors = require('cors');
const asyncrequest = require('request-promise-native');
const session = require('express-session');
const uuidv1 = require('uuid/v1');

dotenv.load();

const app = express();
app.use(cors());
app.use(cookieParser());

app.use(session({
  genid: function(req) {
    return uuidv1();  // use UUIDs for session IDs
  },
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

var client_id=process.env.AUTH0_CLIENT_ID;
var secret=process.env.AUTH0_CLIENT_SECRET;
var scope='patient/*.read'
var redirectUri = process.env.LOCAL_SMART_SVR+'/gpview';

app.get('/launch', function(req, res) {
  var serviceUri = req.query.iss;
  var launchContextId = req.query.launch;
  if (launchContextId == null) {
    return res.status(404).send("Unknown: Launch parameter missing");
  }

  var conformanceUri = serviceUri + "/metadata";
   //todo the auth and token uris form resource server - hard coded at moment should retrieve from resource server
  var authUri = process.env.AUTH0_AUTH_URI;
  var tokenUri = process.env.AUTH0_TOKEN_URI;

  req.session.sessionData = {
                clientId: client_id,
                secret: secret,
                serviceUri: serviceUri,
                redirectUri: redirectUri,
                tokenUri: tokenUri,
                launch: launchContextId
            };

  var redirectUrl = authUri + "?" +
                "response_type=code&" +
                "client_id="+client_id+"&" +
                "scope="+scope+"&" +
                "redirect_uri="+redirectUri+"&" +
                "aud=" + serviceUri + "&" +
                "launch=" + launchContextId + "&" +
                "state=" + req.sessionID;
                //+"&prompt=none"

  res.redirect(redirectUrl);

});


app.get('/gpview', function(req, res) {

  // need tet the code and swap for an access_token - this will then be used by the SMART app to get the resources
  var code = req.query.code;
  let launch= req.session.sessionData.launch;
  let buff = new Buffer.from(launch, 'base64')
  let patientCtx = buff.toString('ascii');

  //now have a handle to internal Health Share Patient identifier
  console.log("context set to " +patientCtx);
  
  if (code !==null){
    // get an access_token - need to use the access_token passed in rather then create a new one
    
    //TODO FIX - should be using the code passed in rather then creating a new token
    var auth_options = { method: 'POST', json: true, uri: 'https://smartonfhir.eu.auth0.com/oauth/token', headers: { 'content-type': 'application/json' }, body: {"client_id":"eOT6fk4c1Jv8pMxEUswgxyTDrOi66Iie","client_secret":"vaZq-jfWRK4egtB5L1XqFxCKucELFXVdS2wWuOvQ9gSpGb1ja7z_-3SJf3p1iGr5","audience":"http://smartonfhir/getcarerecord","scope":"patient/*.read","grant_type":"client_credentials"} };
    // first the widget needs to get an auth_code from the authorisation service at Auth0
      asyncrequest(auth_options).then(function(auth_code){
        // need to get hold of NHS number and odscode
        var template = `
                      <script type="text/javascript" src="https://smart-nexus-apps.azurewebsites.net/build/gprecordcomponent.js"></script>
                      <gprecord-component recordtype="SUM" nhsnumber="9476719958" odscode="A11111" token_type="${auth_code.token_type}" access_token="${auth_code.access_token}"></gprecord-component>
                  `
        
        res.send(template);
      });
  }
  else {
    return res.status(404).send("Authorisation Failed");
  }


});

const { wwwDir, logger } = stencil.initApp({
  app: app,
  configPath: __dirname
});

app.use(express.static(wwwDir));

app.use(function(req, res, next){
  console.error("Unknown path :" +req.url);
  return res.status(404).send("Unknown Path :" +req.url);
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  return res.status(err.status).json({ message: err.message });  
});

// set which port express it will be listening on
var port = process.env.PORT || 4000;
app.listen(port);
console.log('Listening on http://127.0.0.1:'+port);