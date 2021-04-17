const {Thought, User} = require('../models');

const thoughtController = {
    //get all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'reactions',
            select: '___v',
        })
        .populate({
            path: 'thoughts',
            select: '___v',
        })
        .select('-__v')
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get thought by id
    getThoughtById({params}, res) {
        Thought.findOne({_id:params.id})
        .then(dbThoughtData => {
            // if no thought is found
            if(!dbThoughtData) {
                res.status(404).json({message:'no thought with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //create thought to a user
    createThought({body}, res) {
        console.log(body);
        Thought.create(body)
        .then(dbThoughtData => {
            return User.findOneAndUpdate(
                {_id:body.userId},
                {$push: {thoughts:thoughtData._id}},
                {new:true}
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({message: 'no user wiht this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    //update thought by id
    updateThought({params,body}, res) {
        Thought.findOneAndUpdate({_id:params.id}, body, {new:true})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message:'no thought with this id'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.status(400).json(err));
    },

    //delete a thought
    deleteThought({params}, res) {
        Thought.findOneAndDelete({_id:params.id})
        .then(dbThoughtData => {
            if (!dbThoughtData) {
                res.status(404).json({message: 'no thought with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.status(400).json(err));
    },

    // add reaction
    addReaction({params, body}, res) {
        Thought.findOneAndUpdate(
            {_id: params.thoughtId},
            {$addToSet: {reactions: body}},
            {new:true}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData) {
                res.status(404).json({message: 'no thought with this id'});
                return;
            }
            res.json(dbThoughtData);
        })
        .catch(err => res.json(err));
    },

    //delete reaction
    deleteReaction({params}, res) {
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$pull: {reactions: {reactionId: params.reactionId}}},
            {new:true}
        )
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => res.json(err));
    }
};    

module.exports = thoughtController;