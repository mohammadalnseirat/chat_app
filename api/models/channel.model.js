import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({}, { timestamps: true });

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
