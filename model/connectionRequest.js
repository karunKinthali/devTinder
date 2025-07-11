
const mongoose = require('mongoose');
const connectionRequestModel = new mongoose.Schema({
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'accepted', 'rejected'],
            message: `{VALUE} is not allowed`
        }
    }
}, { timestamps: true })

connectionRequestModel.pre('save', function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You can't make a request your self!!!!")
    }
})

const ConnectionRequest = mongoose.model('connectionRequest', connectionRequestModel);

module.exports = { ConnectionRequest }