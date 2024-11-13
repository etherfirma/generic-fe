import _ from 'lodash';

const ZIPCODE = /^(\d{5}(\-\d{4})?)$/;
const PHONE_NUMBER = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
const EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const URL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
const DOMAIN = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}/;
const NUMBER = /^[0-9]+$/;
const FLOAT = /^[+-]?([0-9]*[.])?[0-9]+$/;
const MONGO = /^[0-9a-f]{24}$/;
const SLUG = /^[0-9a-zA-Z_-]+$/;
const DATE = /^((1[012])|([0-9])|(0[0-0]))\/([123]?[0-9])\/(20[0-9][0-9])$/;
const TIME = /^([01][0-9]):([0-6][0-9])$/;

/**
 * General validation utility functions.
 */

class ValidationUtil {
    isSlug (val) {
        return SLUG.test (val);
    }

    isFloat (val) {
        return FLOAT.test(val);
    }

    isDate (val) {
        return DATE.test (val);
    }

    isDomain (val) {
        return DOMAIN.test(val);
    }

    isTime (val) {
        return TIME.test (val);
    }

    isArrayOfMongoIds (val) {
        try {
            const json = JSON.parse (val);
            if (! _.isArray (json)) {
                return false;
            }
            _.each (json, (el, i) => {
                if (! _.isString (el)) {
                    return false;
                } else if (! this.isMongoId (el)) {
                    return false;
                }
            });
        }
        catch (e) {
            return false;
        }

        return true;
    }

    isZipcode (zipcode) {
        return ZIPCODE.test (zipcode);
    }

    isPhoneNumber (val) {
        return PHONE_NUMBER.test (val);
    }

    isEmail (email) {
        return EMAIL.test(String(email).toLowerCase());
    }

    isNumber (val) {
        return NUMBER.test (val);
    }

    // isUrl (url) {
    //     return URL.test (url);
    // }

    isUrl (str) {
        const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        const url = new RegExp(urlRegex, 'i');
        return str.length < 2083 && url.test(str);
    }

    isDomain (str) {
        const regex = '^(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
        const domain = new RegExp(regex, 'i');
        return str.length < 2083 && domain.test(str);
    }

    isMongoId (id) {
        return MONGO.test (id);
    }

    isJsonObject (val) {
        try {
            return _.isObject (JSON.parse (val));
        }
        catch (e) {
            return false;
        }
    }
}

export default new ValidationUtil ();

// EOF