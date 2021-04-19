const {User} = require ('../models');

const userController = {
    //get all users
    getAllUsers(req,res) {
        User.find({})
        .populate({
            path: 'thoughts',
            select: '-__v',
        })
        .select('-__v')
        .sort({_id: -1})
        .then(dbUserData => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get one user by id
    getUserById({params}, res) {
        User.findOne({_id:params.id})
        .populate({
            path:'thoughts',
            select: '-__v',
        })
        .select('-__v')
        .then(dbUserData => {
            //if no user is found
            if (!dbUserData) {
                res.status(404).json({message:'no user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        }); 
    },

    //create user
    createUser({body}, res) {
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    //update user by id
    updateUser ({params, body}, res) {
        User.findOneAndUpdate ({_id:params.id}, body, {new: true})
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message:'no user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //delete user by id
    deleteUser({params}, res) {
        User.findOneAndDelete({_id:params.id})
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'no user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    //add friend
    addFriend(req, res) {
        console.log(req.params, "hello")
        User.findOneAndUpdate(
            {_id:req.params.UserId},
            {$addToSet: {friends: req.params.friendsId}},
            {new: true}
        )
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    //delete friend
    deleteFriend({params}, res) {
        User.findOneAndUpdate(
            {_id: params.UserId},
            {$pull: {friends: params.friendsId}},
            {new:true}
        )
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({message: 'no user found with this id'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    } 
};

module.exports = userController;


