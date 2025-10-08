require('dotenv').config();
const s3 = require('./utils/s3');
const { ListBucketsCommand } = require("@aws-sdk/client-s3");

async function test() {
  try {
    const res = await s3.send(new ListBucketsCommand({}));
    console.log("Buckets:", res.Buckets.map(b => b.Name));
  } catch (err) {
    console.error(err);
  }
}

test();
