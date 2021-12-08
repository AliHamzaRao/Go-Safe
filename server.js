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
