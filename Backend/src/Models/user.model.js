import mongoose, {Schema} from "mongoose";

const userSchema = new Schema ({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    token: {type: String},
    activities: [{
        activity: {type: String},
        timestamp: {type: Date, default: Date.now}
    }]
});

const User = mongoose.model("User", userSchema);
export { User };