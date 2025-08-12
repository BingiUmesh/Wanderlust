const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  // .post(
  //   isLoggedIn,
  //   validateListing,
  //   wrapAsync(listingController.createListing)
  // ); //Create Route
  .post(upload.single("listing[image]"), (req, res) => {
    console.log(req.body);
    console.log(req.file);
    res.send(req.body);
  });

//new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) //show route
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  ) //update route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //delete route

//edit listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
