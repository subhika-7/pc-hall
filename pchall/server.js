const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "https://pc-hall.netlify.app"
}));
app.use(express.json());
app.use(express.static("public")); // serve frontend files

/* -------------------- MONGODB -------------------- */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => { console.error("❌ DB Error:", err); process.exit(1); });

/* -------------------- SCHEMA -------------------- */

const bookingSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  fromDate:  { type: String, required: true }, // "YYYY-MM-DD"
  toDate:    { type: String, required: true }, // "YYYY-MM-DD"
  contact:   { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", bookingSchema);

/* -------------------- HELPERS -------------------- */

// Returns true if two date ranges overlap (inclusive)
function rangesOverlap(aFrom, aTo, bFrom, bTo) {
  return aFrom <= bTo && aTo >= bFrom;
}

/* -------------------- PUBLIC: Check Availability -------------------- */

app.post("/check-availability", async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({ error: "fromDate and toDate required" });
    }

    const bookings = await Booking.find({});

    for (const b of bookings) {
      if (rangesOverlap(fromDate, toDate, b.fromDate, b.toDate)) {
        return res.json({ available: false });
      }
    }

    return res.json({ available: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- ADMIN: Get All Bookings -------------------- */

app.get("/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort({ fromDate: -1 });
    return res.json({ bookings });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- ADMIN: Create Booking -------------------- */

app.post("/admin/book", async (req, res) => {
  try {
    const { name, fromDate, toDate, contact } = req.body;

    if (!name || !fromDate || !toDate) {
      return res.status(400).json({ success: false, message: "name, fromDate, toDate required" });
    }

    // Conflict check
    const existing = await Booking.find({});
    for (const b of existing) {
      if (rangesOverlap(fromDate, toDate, b.fromDate, b.toDate)) {
        return res.json({
          success: false,
          message: `Conflict: Hall is booked from ${b.fromDate} to ${b.toDate} (${b.name})`
        });
      }
    }

    const booking = new Booking({ name, fromDate, toDate, contact: contact || "" });
    await booking.save();

    return res.json({ success: true, booking });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- ADMIN: Delete Booking -------------------- */

app.delete("/admin/booking/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

/* -------------------- HEALTH CHECK -------------------- */

app.get("/health", (_, res) => res.json({ status: "ok", time: new Date() }));

/* -------------------- START -------------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
