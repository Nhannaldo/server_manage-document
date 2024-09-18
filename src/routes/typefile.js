const express = require("express");
const router = express.Router();
const typefileController = require("../controllers/typefileController");

router.get("/get-all-typefile", typefileController.getAllTypeFile);
router.post("/create-new-typefile", typefileController.createNewTypeFile);

module.exports = router;
