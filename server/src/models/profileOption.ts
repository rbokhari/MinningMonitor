import { model, Schema } from 'mongoose';

export const ProfileOptionSchema: Schema = new Schema({
    label: {
        type: String
    },
    core: {
        type: Number
    },
    memory: {
        type: Number
    },
    voltage: {
        type: Number
    },
    powerStage: {
        type: Number
    },
    temperature: {
        type: Number
    },
    fanSpeed: {
        type: Number
    },
    notes: {
        type: String
    },
    status: {
        type: Number
    }
});

export default model('ProfileOption', ProfileOptionSchema);