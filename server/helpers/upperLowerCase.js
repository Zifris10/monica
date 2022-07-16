const firstLetterUpperCase = (word) => {
    const upperCase = word.charAt(0).toUpperCase() + word.slice(1);
    return upperCase;
};

const allLowerCaseLetters = (word) => {
    const lowerCase = word.toLowerCase();
    return lowerCase;
};

module.exports = {
    firstLetterUpperCase,
    allLowerCaseLetters
};