const validateEmpty = (value) => {
    let validate = true;
    if(value === 'undefined' || value === undefined || value === null || value.trim() === '') validate = false;
    return validate;
};

const validateEmail = (email) => {
    let validate = false;
    let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(filter.test(email)) validate = true;
    return validate;
};

const validateFileWeight = (size, weight) => {
    let validate = true;
    if(size > weight) validate = false;
    return validate;
};

const validateImage = (extension) => {
    let validate = false;
    if(extension === 'png' || extension === 'jpg' || extension === 'jpeg') validate = true;
    return validate;
};

const validateNotEmptySpaces = (value) => {
    let validate = true;
    if(value.indexOf(' ') >= 0) validate = false;
    return validate;
};

const validateArray = (array) => {
    let validate = false;
    if(Array.isArray(array) && array.length > 0) validate = true;
    return validate;
};

module.exports = {
    validateEmpty,
    validateEmail,
    validateFileWeight,
    validateImage,
    validateNotEmptySpaces,
    validateArray
};