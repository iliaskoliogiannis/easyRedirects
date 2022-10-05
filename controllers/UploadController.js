const Multer = require("../services/multer");
const excelToJson = require('convert-excel-to-json');
const fse = require('fs-extra');

const index = (req, res) => {

    res.render("index", {
        success: true
    });
}

const upload = (req, res, next) => {

    let upload = Multer.multer({ storage: Multer.storage}).single('excel-file');

    upload(req, res, (err) => {
        
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select a file to upload');
        }
        else if (err instanceof Multer.multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        next();
        
    });

}

const create = (req, res) => {


    let domain = req.body.domain;
    let code = (req.body.code != "") ? req.body.code : "301";
    let name = req.file.filename;
    let path = req.file.path;

    const result = excelToJson({
        sourceFile: 'input/' + name,
        columnToKey: {
            A: 'oldUrl',
            B: 'newUrl',
            C: "code"
        }
    });

    let htaccess = "";

    for(let r of result[Object.keys(result)[0]]){

        let o = r.oldUrl.replace(domain, "");
        let n = r.newUrl.replace(domain, "");
        let c = (r.code != undefined) ? r.code : code;

        if ( n == ""){ n = "/" }

        htaccess += `RewriteCond %{REQUEST_URI} ${o}\n` + 
            `RewriteRule ^ ${n} [R=${c},L] \n\n`;

    }

    fse.remove(path, err => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
    })

    res.set({
        'Content-Type': 'application/force-download',
        'Content-Disposition':'attachment; filename=redirects.txt'
    });
    res.send(htaccess);

}

module.exports = {
    index,
    upload,
    create
}