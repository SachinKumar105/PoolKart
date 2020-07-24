const User = require('../../models/user')
const UserSession = require('../../models/usersession')

module.exports = (app) => {
    app.post('/api/account/signup', (req,res,next) => {
        const { body } = req;
        const {
            username,
            email,
            password,
            role
        } = body;
        if (!username){
            return res.send({
                message: 'Error: username cannot be blank.',
                'username': username
            });
        }
        if (!email){
            return res.send({
                message: 'Error: email cannot be blank.'
            });
        }
        if (!password){
            return res.send({
                message: 'Error: password cannot be blank.'
            });
        }
        if (!role){
            return res.send({
                message: 'Error: Please select your role'
            })
        }

        User.find({
            email: email
        },(err, previousUsers) => {
            if(err){
                return res.send('Error: Server Error')
            } else if(previousUsers.length > 0){
                return res.send('Error: Account already exists')
            }

            const newUser = new User();
            newUser.username = username;
            newUser.email = email;
            newUser.role = role;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if(err){
                    return res.send({
                        message: 'Error: User save error'
                    });
                }
                return res.send({
                    message: 'Signed up'
                });
            })
        });
    });
    app.post('/api/account/signin', (req,res,next) => {
        const { body } = req;
        const {
            email,
            password,
            role
        } = body;
        if (!email){
            return res.send({
                success: false,
                message: 'Error: email cannot be blank.'
            });
        }
        if (!password){
            return res.send({
                success: false,
                message: 'Error: password cannot be blank.'
            });
        }
        User.find({
            email: email
        },(err, users) => {
            if (err){
                return res.send({
                    success: false,
                    message: 'Error: Server error'
                })
            }
            if(users.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid user'
                })
            }
            const user = users[0];

            if(!user.validPassword(password)){
                return res.send({
                    success: false,
                    message: 'Error: Invalid Password'
                });
            }
            const userSession = new UserSession();
            userSession.userId = user._id;
            userSession.save((err, doc) =>{
                if(err){
                    return res.send({
                        success: false,
                        message: 'Error: Save Error'
                    });
                }
                return res.send({
                    success: true,
                    message: 'Valid Sign-in',
                    token: user._id,
                    role: user.role
                })
            });
        })
    });
    app.get('/api/account/verify' , (req,res,next) => {
        const { query } = req;
        const { token } = query;
        // console.log(token);
        UserSession.find({
            userId: token,
            isDeleted: false
        }, (err, sessions) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            if(sessions.length < 1){
                return res.send({
                    success: false,
                    message: 'Error: Not Verified'
                });
            }
            else{
                return res.send({
                    success: true,
                    message: 'Verified'
                });
            }
        })
    });
    app.get('/api/account/logout', (req,res,next) => {
        const { query } = req;
        const { token } = query;

        UserSession.findOneAndUpdate({
            userId: token,
            isDeleted: false
        },{
            $set:{
                isDeleted: true,
                UserId: ''
            }
        },null, (err, sessions) => {
            if (err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            else{

                return res.send({
                    success: true,
                    message: 'Good'
                })
            }
        })
    });
    app.get('/api/account/getuser', (req,res,next) => {
        const { query } = req;
        const { token } = query;
        // console.log('userid-----',token);
        User.findOne({
            _id: token
        }, (err, user) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server Error'
                });
            }
            // if(user.length < 1){
            //     return res.send({
            //         success: false,
            //         message: 'Error: Not Verified'
            //     });
            // }
            else{
                // console.log(user);
                return res.send({
                    token:token,
                    name:user.username,
                    role:user.role,
                    success: true,
                    message: 'Verified'
                });
            }
        })
    })
}