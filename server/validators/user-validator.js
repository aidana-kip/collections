const { body } = require('express-validator');

const signUpValidators = [
    body('email').notEmpty().withMessage({
        en: 'Email cannot be empty',
        ru: "Укажите почтовый адрес"
    }),
    body('email').isEmail().withMessage({
        en: 'Not valid email address',
        ru: "Невалидный почтовый адрес"
    }),
    body('password').isStrongPassword().withMessage({
        en: 'Password is not strong enough',
        ru: "Пароль недостаточно безопасен"
    }),
    body('firstName').notEmpty().withMessage({
        en: 'User first name cannot be empty',
        ru: "Укажите имя"
    })
];

const signInValidators = [
    body('email').notEmpty().withMessage({
        en: 'Email cannot be empty',
        ru: "Укажите почтовый адрес"
    }),
    body('email').isEmail().withMessage({
        en: 'Not valid email address',
        ru: "Невалидный почтовый адрес"
    })
];


module.exports = { signUpValidators, signInValidators }