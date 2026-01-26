import { Schema } from "mongoose";
import { user } from "./user.model.js";

const meetingSchema = new Schema ({
    user_id: {type: String },
    meetingCode: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now, required: true},
}
);

const meeting = mongoose.model("Meeting", meetingSchema);
export { meeting };