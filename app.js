const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/download", async (req, res) => {
  const link = req.body.link;
  console.log(link);
  const startIndex = link.indexOf("e/") + 2; // Get the index after 'v='
  const endIndex = link.indexOf("?"); // Get the index of '&list'

  const videoID = link.substring(startIndex, endIndex);
  console.log(videoID);

  if (videoID === undefined || videoID === "" || videoID === null) {
    return res.render("index", {
      success: false,
      message: "Please enter a video url",
    });
  } else {
    const response = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.api_key,
          "X-RapidAPI-Host": process.env.api_host,
        },
      }
    );
    const result = await response.json();
    if (result.status === "ok") {
      return res.render("index", {
        success: true,
        songName: result.title,
        songLink: result.link,
      });
    } else {
      return res.render("index", { success: false, message: result.message });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
