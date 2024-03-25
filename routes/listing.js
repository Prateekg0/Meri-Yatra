const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post( 
    isLoggedIn, 
    // validateListing, 
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new",isLoggedIn,listingController.renderNewFrom);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put( isLoggedIn, 
    isOwner,
    upload.single("listing[image]"), 
    validateListing,
     wrapAsync(listingController.updateListing))
     .delete( 
     isLoggedIn,
     isOwner, 
     wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn,isOwner, wrapAsync(listingController.renderEditFrom));


module.exports = router;
