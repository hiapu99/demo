const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picture: {
      secure_url:{
        type: String,
        required: true
      },
      public_id:{
        type: String,
        required: true
      },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("category", categorySchema);
