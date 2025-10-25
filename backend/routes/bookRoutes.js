const express = require("express");
const router = express.Router();
const {
  createBook,
  getAllBooks,
  getBookById,
  toggleBookStatus,
  deleteBook,
} = require("../controllers/bookController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createBook);
router.get("/", protect, getAllBooks);
router.get("/:id", protect, getBookById);
router.put("/toggle-status/:id", protect, toggleBookStatus);
router.delete("/:id", protect, deleteBook);

module.exports = router;