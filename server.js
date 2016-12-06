var express = require('express')
var app = express()
var path = require('path')
var validUrl = require('valid-url')

app.use(express.static(path.join(__dirname, 'public')))

var db = {}
db['https://www.google.com'] = 1000;
db['https://www.yahoo.com'] = 2000;
var output = {'Long URL': null, 'Short URL': null}

app.get('/*', function(req, res) {
    var reqUrl = String(req.url)
    var theurl = reqUrl.substring(1)
    
    if (isNumber(theurl) && Number(theurl) < 10000 && Number(theurl) >= 1000) { // if it's short-url number
        var address = findKey(theurl)
        if (address == '') {    // not in db
            res.send('The short-url "' + theurl +'" does not exist in the database')
        } else {        // if short-url matches a db record
            theurl = address
        }
    } else if (!validUrl.isUri(theurl)) {   // when the url is not valid
        res.send(theurl +' is not a valid URL')
    }
        
    updateDB(theurl)
    res.send(output)
 
 res.send(theurl)
})


function findKey(val) {
    for (var key in db) {
        if (db[key] == val)
        return key
    }
    return ''
}

function updateDB(theurl) {
    output['Long URL'] = theurl
    
    if(db.hasOwnProperty(theurl)) {
        output['Short URL'] = db[theurl]
    } else {
        var newID = randomNumber()
        db[theurl] = newID
        output['Short URL'] = newID
    }
}

function randomNumber() {   //generate random 4 digit number
    return Math.floor((Math.random()*9000)+1000)
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

app.listen(process.env.PORT || 8080)