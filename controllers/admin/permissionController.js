
const { validationResult } = require('express-validator');
const Permission = require('../../models/permissionModel')
const addPermission = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(200).json({
                sucess: false,
                msg: 'Error',
                errors: errors.array()
            })
        }
        const { permissions_name } = req.body;
        const isExists = await Permission.findOne({ permissions_name });
        if (isExists) {
            return res.status(400).json({
                sucess: false,
                msg: "Permission name is already exists!"
            })
        }
        var obj = {
            permissions_name
        }
        if (req.body.default) {
            obj.is_default = parseInt(req.body.default);
        }
        const permission = new Permission(obj);
        const newPermission = await permission.save();
        return res.status(200).json({
            sucess: true,
            msg: "Permission added successfully!",
            data:newPermission
        })
    }
    catch (error) {
        return res.status(400).json({
            sucess: false,
            msg: error.message
        })
    }
}

module.exports = {
    addPermission
}