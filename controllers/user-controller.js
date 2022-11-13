const { User, Thought } = require('../models');

const userController = {
    //get all Users
    getAllUser(req, res) {
        User.find({})
        .populate({
            path: 'thoughts', // include details of thoughts in fetch
            select: '-__v' // leave this property out
        })
        .populate({
            path: 'friends', //include details of friends in fetch 
            select: '-__v'
        })
        .select('-__v') // leave this property out for User
        .sort({ _id: -1 }) // sort results by Id
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    // get User by Id
    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
        .then(dbUserData  => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with that ID!'});
                return;
            }

            res.json(dbUserData)
        })
        .catch(err => res.status(400).json(err))
    },


    //create new User
    createUser({ body }, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },


    //update exisiting user by Id
    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with that ID!'});
                return;
            }

            res.json(dbUserData)
        })
        .catch(err => res.status(400).json(err))
    },


    //delete User by Id
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with that ID!'});
                return;
            }

            // bonus: delete all associated thoughts when a user is deleted
            return Thought.deleteMany( { username: dbUserData.username });
        })
        .then(res.json({ message: 'User and associated Thoughts deleted!'}))
        .catch(err => res.status(400).json(err));
    },


    // add new friend to friends list
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId }},
            { new: true, runValidators: true }
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with that ID!'});
                return;
            }

            res.json(dbUserData);
        })
        .catch(err =>  res.status(400).json(err));
    },

    //delete friend from friends list
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } } // pull from friends array 
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with tht ID!'});
                return;
            }
            res.json(dbUserData)
        })
        .catch(err => res.json(err))
    }
};


module.exports = userController;