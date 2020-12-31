const fs = require('fs');
const puppeteer = require('puppeteer');
const express = require("express");
const bodyParser = require("body-parser");
const { get } = require('http');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", function (req, res) {
  fs.readFile('./videos.json', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    let videos = JSON.parse(data); 
    res.send(videos);
  })
});

// /yt-name-link?id=9MwZGT0rySM
app.get("/yt-name-link", async function (req, res) {
 let videoName = await getTitle(req.query.id).replace(" ", "-"); 
  let obj = {
    id: req.query.id,
    name: videoName
  }
  fs.readFile('./videos.json', 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let videos = JSON.parse(data); 
      videos.push(obj);
        fs.writeFile('./videos.json', JSON.stringify(videos), function (err) {
          if (err) return console.log(err);
          res.send("URL shortened " + JSON.stringify(obj));
        });
    });    
});

// /yt-named-link?name=top-20-rat-spots-in-olympus-season-7
app.get("/yt-named-link", function (req, res) {
  console.log(req.query.linkName); 
    fs.readFile('./videos.json', 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      let videos = JSON.parse(data); 
      videos.forEach((obj) => {
        if (obj["name"] == req.query["name"]) {
          console.log(obj.id); 
          res.redirect("https://www.youtube.com/watch?v=" + obj.id);
        }
      });   
    })
  }); 

/* 
needs error handling & 404 
*/

app.listen(3000);

const getTitle = async (id) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage(); 
  await page.goto('https://www.youtube.com/watch?v='+id);
  videoName = await page.title();   
  await browser.close(); 
  return videoName; 
} 
