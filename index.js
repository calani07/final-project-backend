const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const username = "oforicalebani";
const password = "DIT1pe0Rs4qs8qCb";
const connectionString = `mongodb+srv://oforicalebani:${password}@final-project-cluster.qr6ubsf.mongodb.net/?retryWrites=true&w=majority`;
const db = require("./db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParse = require("body-parser");

app.use(express.static("Packrite"));
app.use(express.json());

// New User Registration
app.post("/new-user-registration", async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const contact = req.body.contact;
    const carNumber = req.body.carNumber;

    console.log(username);

    // Hash the password using bcrypt
    const hashedPass = await bcrypt.hash(password, 10);

    console.log(hashedPass);

    // Create a new user using the database model
    await db.User.create({
      username: username,
      email: email,
      password: hashedPass,
      contact: contact,
      carNumber: carNumber,
    });

    res.status(201).json("User registered successfully!");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json("Registration failed");
  }
});

// Login Process
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Retrieve the user from the database based on the email
    const user = await db.User.findOne({ email });

    if (!user) {
      return res.status(401).json("User not found");
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json("Incorrect password");
    }

    res.status(200).json("Login successful!");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json("Login failed");
  }
});

// Updating Packing Slot Status
app.patch("/update-parking-slot-status", async (req, res) => {
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const slot = req.body.slot;
  const isBeingBooked = req.body.isBeingBooked;

  const startTimeDoc = await db.TimeInterval.findOne({
    start_time,
  });
  const endTimeDoc = await db.TimeInterval.findOne({
    end_time,
  });
  const startTimeNumber = startTimeDoc.number;
  const endTimeNumber = endTimeDoc.number;

  // Construct the filter to select documents within the range
  const filter = {
    number: { $gte: startTimeNumber, $lte: endTimeNumber },
  };

  // Construct the update data
  const update = {
    $set: {
      [`slot_${slot}`]: isBeingBooked,
    },
  };

  // Update the selected slot field for the documents within the range
  const updateResult = await db.TimeInterval.updateMany(filter, update);
  const count = await db.TimeInterval.countDocuments(filter);
  if (count === updateResult.modifiedCount) {
    res.json("Booking successful");
  } else {
    res.json("Booking failed!!!");
  }
});

// Checking For Available Paking Slot
app.post("/check-available-slots", async (req, res) => {
  const start_time = req.body.start_time;
  const end_time = req.body.end_time;
  const startTimeDoc = await db.TimeInterval.findOne({
    start_time,
  });
  const endTimeDoc = await db.TimeInterval.findOne({
    end_time,
  });

  if (startTimeDoc === null || endTimeDoc === null) {
    return res.status(400).send("Invalid start or end time");
  }

  const startTimeNumber = startTimeDoc.number;
  const endTimeNumber = endTimeDoc.number;
  const documentsInRange = await db.TimeInterval.find({
    number: { $gte: startTimeNumber, $lte: endTimeNumber },
  });

  // Step 1: Initialize an object to store the slot status
  const slotStatus = {
    slot_1: true,
    slot_2: true,
    slot_3: true,
    slot_4: true,
    slot_5: true,
    slot_6: true,
    slot_7: true,
    slot_8: true,
  };

  // Step 2: Loop through the obtained documents and update the slot status
  for (const doc of documentsInRange) {
    for (const slot in slotStatus) {
      // Update the slot status based on the current document's slot value
      slotStatus[slot] = slotStatus[slot] && doc[slot];
    }
  }

  // Step 3: Collect the selected slots that produce the output true
  const selected_slots = [];
  for (const slot in slotStatus) {
    if (slotStatus[slot]) {
      selected_slots.push(slot);
    }
  }

  // Step 4: Send the selected slots as the response
  res.json(selected_slots);
});

async function main() {
  await mongoose.connect(connectionString);
}

main()
  .then(() => {
    app.listen(port, () => console.log("The server is running!!!"));
  })
  .catch(() => {
    console.log("An error occurred!!!");
  });
