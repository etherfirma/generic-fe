import ValidationUtil from "../util/ValidationUtil";
import _ from "lodash";
import {objGet} from "../util/Utils";

/**
 * A utility class for doing form validaiton.
 */

class Validator {
    constructor (obj, fields, accessor) {
        this.obj = obj;
        this.fields = fields;
        this.accessor = accessor || ((obj) => obj.store);
    }

    static urlValidator (val) {
        if (!ValidationUtil.isUrl(val)) {
            return "Not a URL";
        } else {
            return null;
        }
    }

    static intValidator (val) {
        if (! ValidationUtil.isNumber(val)) {
            return "Not a number.";
        } else {
            return null;
        }
    }

    static floatValidator (val) {
        if (! ValidationUtil.isFloat (val)) {
            return "Not a float.";
        } else {
            return null;
        }
    }

    static oidValidator (val) {
        if (! ValidationUtil.isMongoId(val)) {
            return "Not a mongo oid.";
        } else {
            return null;
        }
    }

    static emailValidator (val) {
        if (! ValidationUtil.isEmail(val)) {
            return "Not an email address.";
        } else {
            return null;
        }
    }
    static domainValidator (val) {
        if (!ValidationUtil.isDomain(val)) {
            return "Not a domain.";
        } else {
            return null;
        }
    }

    static stringValidator (val, min, max) {
        if (min && val.length < min) {
            return `Value must be at least ${min} characters.`;
        } else if (max && val.length > max) {
            return `Value must be at most ${max} characters.`;
        } else {
            return null;
        }
    }
    static nonNullValidator (val) {
        if (val == null) {
            return true;
        } else {
            return null;
        }
    }
    static jsonObjectValidator (val) {
        try {
            const json = JSON.parse(val);
            if (_.isArray(json) || !_.isObject(json)) {
                return "Not an object.";
            }
        } catch (e) {
            return e.toString();
        }
        return null;
    }

    get isValid () {
        return Object.keys (this.obj.store.errors).length === 0;
    }

    validate () {
        const errors = { };
        _.map (this.fields, (field, i) => {
            const value = objGet (this.accessor (this.obj), field.path);
            if (field.required && ! value) {
                if (field.name) {
                    errors[field.path] = field.name + " is required.";
                } else {
                    errors[field.path] = "Value is required.";
                }
            } else if (field.validator) {
                const error = field.validator (value);
                if (error) {
                    errors [field.path] = error;
                }
            }
        });
        this.obj.store.errors = errors;
    }
}

export default Validator;

// EOF