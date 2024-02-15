const { model, Schema } = require("mongoose");

const TagsSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
});

model("Tags", TagsSchema);

module.exports = model("Tags", TagsSchema);
