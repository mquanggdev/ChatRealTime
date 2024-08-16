const generateToken = () => {
    const string = "abcdefghijklmnopqrstuvwxyzABCDEFJHỊKLMNOPQRSTUVWXYZ1234567890" ;

    const token = "";
    for (let i = 0 ; i < string.length ; i++ ){
        token += string.charAt(Math.floor(Math.random() * string.length));
    }
    return token ;
}

module.exports.generateToken = generateToken ;