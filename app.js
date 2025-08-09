const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const methodOverride = require("method-override");

const Listing = require("./models/listing.js");

app.use(methodOverride("_method"));

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

//new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
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

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit listing
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

//update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...listing });
  res.redirect(`/listings/${id}`);
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
