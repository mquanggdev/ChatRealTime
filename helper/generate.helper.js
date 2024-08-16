const generateToken = (lengthToken) => {
    const string = "abcdefghijklmnopqrstuvwxyzABCDEFJHỊKLMNOPQRSTUVWXYZ1234567890" ;

    let token = "";
    for (let i = 0 ; i < lengthToken ; i++ ){
        token += string.charAt(Math.floor(Math.random() * string.length));
    }
    return token ;
}

module.exports.generateToken = generateToken ;