const express = require("express");
const router = express.Router();
const {
  sendMoney,
  addMoney,
  getTransactionsByBook,
  getTransactionById,
  updateTransaction,
} = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

router.post("/send", protect, sendMoney);
router.post("/add", protect, addMoney);
router.get("/:bookId", protect, getTransactionsByBook);
router.get("/transaction/:id", protect, getTransactionById); 
router.put("/transaction/:id", protect, updateTransaction);


module.exports = router;
