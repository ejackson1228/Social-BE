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
    // get thought by Id in URL parameter
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
    // create thought and add it to User thought array property 
    //body expects thoughtText, username, and userId
    createThought({ body }, res) { 
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
    //update thought 
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
    //delete thought and remove it from User thought array property 
    //body expects thoughtText, username, userId
    deleteThought( { params }, res) { 
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
            if(!dbUserData) {
                res.status(404).json({ message: 'No User found with that ID!'})
                return;
            }

            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err))
    },
    //create a reaction to a thought/add it to thought reaction array 
    //body expects reactionBody & username properties
    createReaction( { params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No thought found with that ID!'})
                return
            }

            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err))
    },
    //delete reaction/remove it from thought reaction array 
    deleteReaction( { params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({ message: 'No Thought found with that ID!'})
                return;
            }

            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err))
    }
};


module.exports = thoughtController;