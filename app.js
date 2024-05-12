const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());

const deploymentsPath = path.join(__dirname, "deployments.json");

function getDeployments() {
  const data = fs.readFileSync(deploymentsPath);
  return JSON.parse(data);
}

function updateDeployments(data) {
  fs.writeFileSync(deploymentsPath, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  const environments = getDeployments();
  res.render("index", { environments });
});

app.post("/update-deployment", (req, res) => {
  const { env, lastDeployed, branchCommit } = req.body;
  const data = getDeployments();
  data[env] = { lastDeployed, branchCommit };
  updateDeployments(data);
  res.send({ message: "Deployment updated successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
