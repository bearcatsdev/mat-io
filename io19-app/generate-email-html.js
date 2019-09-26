exports.generate = (name, dietary, imgUrl) => {
    // generate HTML file
    let fs = require('fs');
    
    let result = fs.readFileSync('email-template.html', 'utf8')
            .replace("string_replace_name", name)
            .replace("string_replace_qrcode_src", 'cid:reservation_qr')
            .replace("string_replace_food", dietary);

    return result;
}