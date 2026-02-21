const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

let bookings = [
  { date: "2026-02-20", start: 17, end: 19 }
];

app.post("/check-availability", (req, res) => {
  const { date, start, end } = req.body;

  for (let booking of bookings) {
    if (booking.date === date) {
      if (start < booking.end && end > booking.start) {
        return res.json({ available: false });
      }
    }
  }

  return res.json({ available: true });
});
mongoose.connect("mongodb+srv://j3rry:Subhika2006@pchall-cluster.ibee1uw.mongodb.net/bookingDB")
.then(() => console.log("Database Connected"))
.catch(err => console.log(err));
const bookingSchema = new mongoose.Schema({
  date: String,
  timeSlot: String,
  name: String
});

const Booking = mongoose.model("Booking", bookingSchema);

/* -------------------- TEST ROUTE -------------------- */

app.get("/test", async (req, res) => {
  const newBooking = new Booking({
    date: "2026-02-20",
    timeSlot: "10AM",
    name: "Jerry"
  });

  await newBooking.save();

  res.send("Test Booking Saved");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

