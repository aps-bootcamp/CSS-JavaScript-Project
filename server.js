require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const { PORT } = process.env;

app.use(cors(), express.json(), express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome to APSignals educational website");
});

app.get("/getAllCourses", (req, res) => {
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file");
      return;
    }

    const jsonData = JSON.parse(data);
    res.json(jsonData);
  });
});

app.get("/getCourse", (req, res) => {
  const { id } = req.query;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file");
      return;
    }

    const jsonData = JSON.parse(data);
    res.json(jsonData.find((item) => item.id === +id));
  });
});

app.post("/createCourse", (req, res) => {
  const jsonContent = req.body;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file");
      return;
    }

    const jsonData = JSON.parse(data);
    const id = jsonData[jsonData.length - 1].id;

    fs.writeFile("data.json", JSON.stringify(jsonData.concat({ id: id + 1, ...jsonContent })), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing JSON file");
        return;
      }
      res.send("JSON file written successfully");
    });
  });
});

app.patch("/updateCourse", (req, res) => {
  const jsonContent = req.body;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file");
      return;
    }

    const jsonData = JSON.parse(data);
    jsonData.forEach((item, index) => {
      if (item.id === jsonContent.id) {
        jsonData.splice(index, 1, { ...jsonContent });
      }
    });

    fs.writeFile("data.json", JSON.stringify(jsonData), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing JSON file");
        return;
      }
      res.send("JSON file written successfully");
    });
  });
});

app.delete("/deleteCourse", (req, res) => {
  const { id } = req.query;
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading JSON file");
      return;
    }

    const jsonData = JSON.parse(data);
    jsonData.forEach((item, index) => {
      if (item.id === +id) {
        jsonData.splice(index, 1);
      }
    });

    fs.writeFile("data.json", JSON.stringify(jsonData), "utf8", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing JSON file");
        return;
      }
      res.send("JSON file written successfully");
    });
  });
});

app.listen(PORT || 5555, () => console.log("Server is running"));
