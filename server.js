<<<<<<< HEAD
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(__dirname + "/dist/"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
app.listen(process.env.PORT || 8080);
=======
const ftp = require("basic-ftp");
example();
async function example() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    await client.access({
      host: "148.66.136.10",
      user: "cmpInfo@gosafesystem.com.pk",
      password: "kwxjC]3dxInh",
      secure: false,
    });
    console.log(await client.list());
    await client.downloadTo("src/app/companyInfo.json", "companyInfo.json");
  } catch (err) {
    console.log(err);
  }
}
>>>>>>> c2d1300c702882af8f0fee3827aa73988c9ec02a
