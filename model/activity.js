const { model, Schema } = require("mongoose");

const ActivitySchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  billable: {
    type: Boolean,
    required: true,
  },
  plannedQuota: {
    type: Number,
    required: true,
  },
  tags: {
    type: Array,
    items: {
      type: Object,
    },
  },
});

model("Activity", ActivitySchema);

module.exports = model("Activity", ActivitySchema);
