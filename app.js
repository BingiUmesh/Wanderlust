const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const Listing = require("./models/listing.js");

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));

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
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//show route -> show particular listing
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//edit listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "Send valid data for listing");
    }
    let { id } = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

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

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(port, (req, res) => {
  console.log(`Server is running at port ${port}`);
});
