const Multer = require("../services/multer");
const excelToJson = require('convert-excel-to-json');
const write = require('write');

const index = (req, res) => {
    res.render("index", {
        success: true,
        redirects: null
    });
}

const upload = (req, res, next) => {

    let upload = Multer.multer({ storage: Multer.storage}).single('excel-file');

    upload(req, res, (err) => {
        
        let domain = req.body.domain;

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
    let name = req.file.filename;

    const result = excelToJson({
        sourceFile: 'input/' + name,
        columnToKey: {
            A: 'oldUrl',
            B: 'newUrl'
        }
    });

    let htaccess = "";

    for(let r of result[Object.keys(result)[0]]){

        let o = r.oldUrl.replace(domain, "");
        let n = r.newUrl.replace(domain, "");

        if ( n == ""){ n = "/" }

        htaccess += "RewriteCond %{REQUEST_URI} " + o + "\n" + 
            "RewriteRule ^ " + n + " [R=301,L]" + "\n\n";

    }

    write.sync("output/redirects.txt", htaccess, {
        newline: true,
        overwrite: true
    });

    res.render("index", {
        success: true,
        redirects: "/output/redirects.txt"
    });

}

module.exports = {
    index,
    upload,
    create
}