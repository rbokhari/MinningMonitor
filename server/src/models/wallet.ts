import { model, Schema } from 'mongoose';

export const WalletSchema: Schema = new Schema({
    name: {
        type: String
    },
    ethAddress: {
        type: String
    },
    notes: {
        type: String,
    },
    status: {
        type: Number
    }
});

export default model('Wallet', WalletSchema);