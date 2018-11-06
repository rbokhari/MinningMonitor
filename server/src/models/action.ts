import { model, Schema } from 'mongoose';

export const ActionSchema: Schema = new Schema({
    // rig: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'Rig'
    // },
    rig: {
        type: String
    },
    action: {
        type: Number
    },
    status: {
        type: Number
    }
});

export default model('Action', ActionSchema);