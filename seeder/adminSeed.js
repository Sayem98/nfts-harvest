const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const Admin = require("../models/Admin");
const db = require("../config/db");

async function seed() {
  await Admin.deleteMany();
  await Admin.create({ address: process.env.ADMIN_ADDRESS });

  console.log("Seeding completed!");

  // Exit the process
  process.exit(0);
}

db().then(() => {
  console.log("DB connection successful!");
  console.log(`---Seeding to ${process.env.NODE_ENV} database---`);
  seed();
});
