
// init project
const express = require('express');
const session = require('express-session');
const auth = require('./libs/auth');
const app = express();

app.use(session({
    secret: 'secret', // You should specify a real secret here
    resave: true,
    saveUninitialized: false,
    proxy: true,
    cookie:{
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    }
  }));

app.use((req, res, next) => {
if (process.env.PROJECT_DOMAIN) {
    process.env.HOSTNAME = `${process.env.PROJECT_DOMAIN}.glitch.me`;
} else {
    process.env.HOSTNAME = req.headers.host;
}
const protocol = /^localhost/.test(process.env.HOSTNAME) ? 'http' : 'https';
process.env.ORIGIN = `${protocol}://${process.env.HOSTNAME}`;
if (
    req.get('x-forwarded-proto') &&
    req.get('x-forwarded-proto').split(',')[0] !== 'https'
) {
    return res.redirect(301, process.env.ORIGIN);
}
req.schema = 'https';
next();
});

app.use('/auth', auth);

app.get("/.well-known/assetlinks.json", (req, res) => {
    const assetlinks = [];
    assetlinks.push({
      relation : ["delegate_permission/common.handle_all_urls"],
      target : {
        namespace : "android_app",
        package_name : "com.entersekt.fido2",
        sha256_cert_fingerprints : [
          "C5:8B:E3:9B:36:B3:67:12:D7:0C:DA:C5:9D:65:2A:FC:43:9B:AE:1B:76:C9:7D:A1:7E:69:2B:7A:15:AB:27:96"
        ]
      }
    });
  
    res.json(assetlinks);
})

// listen for req :)
const port = process.env.GLITCH_DEBUGGER ? null : 8080;
const listener = app.listen(port || process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});




