const multer  = require('multer');
const path = require('path');

//const storage = multer.memoryStorage();
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'input/');
    },

    filename: (req, file, cb) => {
        cb(null, "temp" + path.extname(file.originalname));
    }
});

module.exports = {
    multer,
    storage
};