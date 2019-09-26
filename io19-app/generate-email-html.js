exports.generateHtml = (name, dietary, imgUrl, code) => {
    // generate HTML file
    let fs = require('fs');

    let result = fs.readFileSync('email-template.html', 'utf8')
        .replace("string_replace_name", name)
        .replace("string_replace_qrcode_src", 'cid:reservation_qr')
        .replace("string_replace_food", dietary)
        .replace("string_replace_code_text", code);

    return result;
}

exports.generateText = (name, dietary, code) => {
    let content = "Hey, string_replace_name\n\nThis is your e-ticket for MAT I/O 2019.\nPlease show this ticket to the registration crew at the event.\n\nLocation: BINUS University - Kijang Campus Hall\nDate/Time: Friday, October 4th, 2019 2.45pm - finish\nFood preference: string_replace_food\n\nTicket code: string_replace_code_text";

    let result = content
        .replace("string_replace_name", name)
        .replace("string_replace_food", dietary)
        .replace("string_replace_code_text", code);

    return result;
}