const getRandomString = (length: number): string => {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export default {
    generateRandomKeySearch: ():string => {
        return getRandomString(4) + Math.floor(Math.random()*100).toString()
    }
}