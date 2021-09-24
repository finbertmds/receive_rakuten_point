import config from "../../config";

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
        return config.WEBSEARCH_PREFIX + " " + getRandomString(2) + " " + Math.floor(Math.random()*10000).toString()
    }
}