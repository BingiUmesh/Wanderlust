const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const port = 8080;

const Listing = require("./models/listing.js");
const { title } = require("process");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

main()
  .then((res) => {
    console.log("DB Connected Sucessfully");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("working");
});

//index route -> all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//show route -> show particular listing
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Testing listing model
// app.get("/testlisting", async (req, res) => {
//   let listing1 = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Goa",
//     country: "India",
//   });
//   await listing1.save();
//   console.log("sample saved");
//   res.send("Sucessful");
// });

app.listen(port, (req, res) => {
  console.log(`Server is running at port ${port}`);
});
