const { check } = require('express-validator');

exports.permissionAddValidator = [
    check('permissions_name','Permission name is required').not().isEmpty(),
]