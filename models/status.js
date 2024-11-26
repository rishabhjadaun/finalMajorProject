const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status: { type: Boolean, default: false },
});

module.exports = mongoose.model("Status", statusSchema);
