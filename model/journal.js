import mongoose from "mongoose";

const journalSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const journalpost = mongoose.model("JournalPost", journalSchema);

export default journalpost;
