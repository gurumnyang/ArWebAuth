const joi = require("./joiKR");
const customJoi = require('./joiKR');
const idSchema = customJoi.string().pattern(/^[a-zA-Z0-9]+$/).min(3).max(20).required().messages({
    'string.pattern.base': '아이디는 영어와 숫자만 사용 가능합니다'
});
const usernameSchema = customJoi.string().pattern(/^[a-zA-Z가-힣0-9]+$/).min(1).max(20).required().messages({
    'string.pattern.base': '사용할 수 없는 문자가 포함되어 있습니다.'
});
const passwordSchema = customJoi.string().max(50).pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')).required().messages({
    'string.pattern.base': '비밀번호는 최소 8자 이상이어야 하며, 영문, 숫자, 특수문자를 포함해야 합니다',
    'string.empty': '8자 이상의 영문, 숫자, 특수문자를 사용하세요.',
    'any.required': '비밀번호는 필수 입력 항목입니다',
    'string.max': '최대 50자 이하이어야 합니다'
});
const confirmPasswordSchema = customJoi.any().valid(joi.ref('password')).required();
const termsSchema = customJoi.boolean().valid(true).required();

//학생용
const studentIdSchema = customJoi.string().pattern(/^[1-3][0-9]{4}$/).min(5).max(5).required().messages({
    'string.pattern.base': '학번 5자리를 입력해주세요',
    'string.min': '학번은 5자리여야 합니다',
    'string.max': '학번은 5자리여야 합니다'
});

const nameSchema = customJoi.string().pattern(/^[a-zA-Z가-힣]+$/).min(2).max(10).required().messages({
    'string.pattern.base': '사용할 수 없는 문자가 포함되어 있습니다.',
    'string.min': '학적상 이름을 명확히 입력해주세요',
    'string.max': '학적상 이름을 명확히 입력해주세요',
});

//점주용 인증키 스키마
const authKeySchema = customJoi.string().required();


const studentSchema = joi.object({
    id: idSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    terms: termsSchema,

    studentId: studentIdSchema,
    name: nameSchema
});

const businessSchema = joi.object({
    id: idSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    terms: termsSchema,

    authKey: authKeySchema
});


module.exports = {
    studentSchema,
    businessSchema
};