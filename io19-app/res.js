exports.ok = (res, response) => {
    const data = {
        'status': 200,
        'response': response
    };
    res.json(data);
    res.end();
};

exports.badrequest = (res, error) => {
    const data = {
        'status': 400,
        'error_message': error
    };
    res.status(400).json(data);
    res.end();
};

exports.notfound = (res) => {
    const data = {
        'status': 404,
        'error_message': 'Not Found.'
    };
    res.status(404).json(data);
    res.end();
};