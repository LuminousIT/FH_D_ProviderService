const { model, Schema } = require("mongoose");

const ProjectSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    items: {
      type: Object,
    },
  },
  activities: {
    type: Array,
    items: {
      type: Object,
    },
  },
});

model("Project", ProjectSchema);

module.exports = model("Project", ProjectSchema);
