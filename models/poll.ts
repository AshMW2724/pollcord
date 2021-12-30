import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this poll.'],
    maxlength: [20, 'Name cannot be more than 60 characters'],
  },
  id: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
    default: true,
  },
  prompt: {
    type: String,
    required: true,
    default: 'Prompt was lost in shipping...',
    minlength: 5,
    maxlength: 500,
  },
  options: {
    type: [String],
    required: true,
    maxlength: 10,
    minlength: 2,
  },
  inputs: {
    type: [
      {
        id: {
          type: String,
          required: true,
        },
        input: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    required: true,
  },
});

export default mongoose.models.Poll || mongoose.model('Poll', PollSchema);
