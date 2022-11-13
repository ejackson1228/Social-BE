const { Thought, User } = require('../models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .sort({createdAt: -1})
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.status(400).json(err))
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id})
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought found with that ID!'})
                return;
            }

            res.json(dbThoughtData)
        })
        .catch(err => res.status(404).json(err));
    },

    createThought({ body }, res) { //expects thoughtText, username, and userId
        Thought.create(body)
        .then(({ _id }) => { // add new thoughts to thought array property in User model
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'Thought created but no user found with that ID!'})
            return;
            }

            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with that ID!'})
                return;
            }

            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err)) 
    },

    deleteThought( { params }, res) { //expects thoughtText, username, userId
        Thought.findOneAndDelete({ _id: params.id })
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought found with that ID!'})
                return;
            }
            // delete thought from thoughts array property in User model 
            return User.findOneAndUpdate(
                { thoughts: params.id },
                { $pull: { thoughts: params.id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No User found with that ID!'})
                return;
            }

            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err))
    }

    
};


module.exports = thoughtController;