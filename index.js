const express = require("express");
const bodyParser = require("body-parser");

// These are now route imports, not database imports!
const users = require("./routes/users");
const posts = require("./routes/posts");
const comments = require("./routes/comments");

const app = express();
const port = 3000;

// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// Logging Middlewaare
app.use((req, res, next) => {
  const time = new Date();

  console.log(
    `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  // if (Object.keys(req.body).length > 0) {
  //   console.log("Containing the data:");
  //   console.log(`${JSON.stringify(req.body)}`);
  // } else {
  //   console.log(`Doesn't contain any data`);
  // }
  next();
});

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
  var key = req.query["api-key"];

  // Check for the absence of a key.
  if (!key) {
    res.status(400);
    return res.json({ error: "API Key Required" });
  }

  // Check for key validity.
  if (apiKeys.indexOf(key) === -1) {
    res.status(401);
    return res.json({ error: "Invalid API Key" });
  }

  // Valid key! Store it in req.key for route access.
  req.key = key;
  next();
});

// Use our Routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);

app.get("/", (req, res) => {
  res.send("Work in progress!");
});

// 404 Middleware
app.use((req, res) => {
  res.status(404);
  res.json({ error: "Resource Not Found" });
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}.`);
});
