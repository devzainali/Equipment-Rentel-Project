const jwt = require('jsonwebtoken');
const config = require('config');
const UserRole = require('../src/models/user/userRoles/userRoles');


module.exports = function (req, res, next) {

    //create user entry in roles table
    var checkRole = checkUserRole(req.user.ID, 1);
    checkRole.then(function (Response) {
        if (Response.status == 1) {
            next();

        } else {
            res.status(403).json({
                message: "you are not authorized.",
                data: []
            });
        }



    }, function (err) {

        res.status(403).json({
            message: "Problem occur",
            data: err.message
        });

    });


}

function checkUserRole(userID, roleID) {

    return new Promise(function (resolve, reject) {
        UserRole.findAndCountAll({
            where: {
                userID: userID,
                roleID: roleID,
            },
        }).then(UserRole => {
            let status;
            status = { "status": UserRole.count };
            resolve(status);



        }).catch(function (err) {
            reject(err.message);
        });

    }, function (err) {
        reject(err.message);
    });

}