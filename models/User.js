const { Schema, model }  = require('mongoose');

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
            }
        ],
        friends: [
            {
            type: Schema.Types.ObjectId,
            unique: true,
            ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

UserSchema.virtual('friendCount').get(function()  {
    return this.friends.length;     // reduce((total, user) => total = user.friends.length + 1, 0);
});

const User = model('User', UserSchema);

module.exports = User;