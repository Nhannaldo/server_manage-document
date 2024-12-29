const express = require("express");
const router = express.Router();
const typefileController = require("../controllers/typefileController");

router.get("/get-all-typefile", typefileController.getAllTypeFile);
router.post("/create-new-typefile", typefileController.createNewTypeFile);

router.get("/get-typefile/:id", typefileController.getTypeFileById);
router.put("/update-typefile/:id", typefileController.updateTypeFile);
router.delete("/delete-typefile/:id", typefileController.deleteTypeFile);
module.exports = router;
