let fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", function (req, res) {
  fs.readFile('./shortened-urls.json', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let shortened_urls = JSON.parse(data); 
    res.send(shortened_urls);
});

// /shorten?url=http://google.com&id=google
app.get("/shorten", function (req, res) {
  let url = req.query.url;
  let id = req.query.id;
  let obj = {
    url,
    id
  };
  fs.readFile('./shortened-urls.json', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(data)
    let shortened_urls = JSON.parse(data); 
    shortened_urls.push(obj);
      fs.writeFile('./shortened-urls.json', JSON.stringify(shortened_urls), function (err) {
        if (err) return console.log(err);
        res.send("URL shortened " + obj);
      });
  }); 
});

// /shorten?id=google
app.get("/shortened", function (req, res) {
  console.log(req.query.id); 
    fs.readFile('./shortened-urls.json', 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let shortened_urls = JSON.parse(data); 
      shortened_urls.forEach((obj) => {
        if (obj.id == req.query.id) {
          res.redirect(obj.url);
        }
      });   
    })
  }); 
});

/* 
needs error handling & 404 
*/

app.listen(3000);
