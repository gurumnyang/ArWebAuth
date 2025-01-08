//왜 이 파일을 보고계신가요?


const customMessages = {
    'string.min': '최소 {#limit}자 이상이어야 합니다',
    'string.max': '최대 {#limit}자 이하이어야 합니다',
    'string.empty': '필수 입력 항목입니다',
    'any.required': '필수 입력 항목입니다',
    'any.only': '값이 일치하�� 않습니다',
    'boolean.base': '올바른 값을 입력하세요',
    'number.base': '숫자여야 합니다',
    'number.min': '최소 {#limit} 이상이어야 합니다',
    'number.max': '최대 {#limit} ��하이어야 합니다'
};

// Apply custom messages to Joi
const customJoi = joi.defaults(schema => schema.options({messages: customMessages}));

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

// Overall validation schema
let schemaObj = {
    id: idSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    terms: termsSchema
};

let _validation = {
    id: false,
    username: false,
    password: false,
    confirmPassword: false,
    terms: false
};

const userType = $('meta[name="ut"]').attr('content') || new URLSearchParams(location.search).get('ut');
if (userType === 'student') {
    Object.assign(schemaObj, {
        studentId: studentIdSchema, //학번
        name: nameSchema //이름
    });
    Object.assign(_validation, {
        studentId: false, //학번
        name: false // 이름
    });
} else if (userType === 'business') {
    Object.assign(schemaObj, {
        authKey: authKeySchema
    });
    Object.assign(_validation, {
        authKey: false
    });
} else {
    console.log('Invalid user type');
}


const validationSchema = customJoi.object(schemaObj);


//_validation 값이 변경될 때마다 버튼을 활성화/비활성화 프록시
const validation = new Proxy(_validation, {
    set(target, property, value) {
        target[property] = value;
        checkButton();
        return true;
    }
});

//버튼 활성화/비활성화
function checkButton() {
    const registerButton = $('#registerButton');
    for (let key in validation) {
        if (!validation[key]) {
            registerButton.prop('disabled', true);
            return;
        }
    }
    registerButton.prop('disabled', false);
}

$(document).ready(() => {
    const id = $('#inputId');
    const username = $('#inputUsername');
    const pw = $('#inputPassword');
    const cfPW = $('#passwordCheck');
    const privacy = $('#privacyCheck');
    //학생/점주
    const studentId = $('#inputStudentId');
    const studentName = $('#inputStudentName');
    const authKey = $('#inputAuthKey');

    const error_default = $('#error-message');
    const error_username = $('#error-message-username');
    const error_id = $('#error-message-id');
    const error_pw = $('#pwHelpline');
    const error_cfPW = $('#error-message-password-check');

    const error_student = $('#student-helpline');
    const error_authKey = $('#authKey-helpline');

    /**
     * info element type 수정
     * @param doc element
     * @param type error, success, muted
     */
    function switchType(doc, type) {
        if (!doc || !type) return;
        switch (type) {
            case "error":
                doc.removeClass('text-success');
                doc.removeClass('text-muted');
                doc.addClass('text-danger');
                break;
            case "success":
                doc.removeClass('text-danger');
                doc.removeClass('text-muted');
                doc.addClass('text-success');
                break;
            case "muted":
                doc.removeClass('text-danger');
                doc.removeClass('text-success');
                doc.addClass('text-muted');
                break;
        }
    }

    // 공통 입력 검증 함수
    function validateInput(field, schema, errorField, validationKey, successMessage = '') {
        field.on('input', async () => {
            const value = field.val();
            if (!value) {
                errorField.html('');
                validation[validationKey] = false;
                return;
            }

            const { error } = schema.validate(value);
            if (error) {
                errorField.html(error.details[0].message);
                validation[validationKey] = false;
                switchType(errorField, 'error');
                return;
            }

            validation[validationKey] = true;
            errorField.html(successMessage);
            switchType(errorField, 'success');
        });
    }

// ID 검증 전용 함수 (중복 체크 포함)
    function validateId(field, schema, errorField, validationKey, endpoint) {
        let checkSoonTimer = null;

        field.on('input', async () => {
            const value = field.val();
            if (!value) {
                errorField.html('');
                switchType(errorField, 'error');
                validation[validationKey] = false;
                return;
            }

            const { error } = schema.validate(value);
            if (error) {
                errorField.html(error.details[0].message);
                switchType(errorField, 'error');
                validation[validationKey] = false;
                return;
            }

            switchType(errorField, 'muted');
            errorField.html('중복 확인 중...');

            const now = Date.now();
            checkSoonTimer = now;

            setTimeout(async () => {
                if (checkSoonTimer !== now) return;

                try {
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: value }),
                    });

                    if (response.status !== 200) {
                        errorField.html('이미 존재하는 아이디입니다');
                        switchType(errorField, 'error');
                        validation[validationKey] = false;
                        return;
                    }

                    errorField.html('사용 가능한 아이디입니다.');
                    validation[validationKey] = true;

                    switchType(errorField, 'success');
                } catch {
                    errorField.html('서버 요청 중 오류가 발생했습니다.');
                    switchType(errorField, 'error');
                    validation[validationKey] = false;
                }
            }, 1000);
        });
    }

// 비밀번호와 비밀번호 확인 검증
    function validatePassword(pwField, confirmPwField, pwErrorField, confirmPwErrorField) {
        pwField.on('input', () => {
            const { error } = passwordSchema.validate(pwField.val());
            if (error) {
                pwErrorField.html(error.details[0].message).addClass('text-danger');
                validation.password = false;
            } else {
                pwErrorField.html('').removeClass('text-danger');
                validation.password = true;
            }

            validatePasswordMatch(pwField, confirmPwField, confirmPwErrorField);
        });

        confirmPwField.on('input', () => {
            validatePasswordMatch(pwField, confirmPwField, confirmPwErrorField);
        });
    }

    function validatePasswordMatch(pwField, confirmPwField, confirmPwErrorField) {
        if (pwField.val() !== confirmPwField.val()) {
            confirmPwErrorField.html('비밀번호가 일치하지 않습니다');
            validation.confirmPassword = false;
        } else {
            confirmPwErrorField.html('');
            validation.confirmPassword = true;
        }
    }

// 이벤트 초기화
    function initializeValidation() {
        validateInput(username, usernameSchema, error_username, 'username');
        validateId(id, idSchema, error_id, 'id', '/auth/check-id');
        validatePassword(pw, cfPW, error_pw, error_cfPW);

        if (privacy) {
            privacy.on('input', () => {
                validation.terms = !!privacy.is(':checked');
            });
        }

        if (studentId) {
            validateInput(studentId, studentIdSchema, error_student, 'studentId');
        }

        if (studentName) {
            validateInput(studentName, nameSchema, error_student, 'name');
        }

        if (authKey) {
            validateInput(authKey, authKeySchema, error_authKey, 'authKey');
        }
    }
    initializeValidation();


    $('#signup-form').on('submit', async (event) => {
        event.preventDefault();
        let data = {
            id: id.val().trim(),
            username: username.val().trim(),
            password: pw.val(),
            confirmPassword: cfPW.val(),
            terms: privacy.is(':checked')
        };

        /*if (studentId) {
            data.studentId = studentId.val().trim();
        }
        if (studentName) {
            data.name = studentName.val().trim();
        }
        if (authKey) {
            data.authKey = authKey.val().trim();
        }*/

        if(userType === 'student') {
            data.studentId = studentId.val().trim();
            data.name = studentName.val().trim();
        } else if(userType === 'business') {
            data.authKey = authKey.val().trim();
        } else {
            console.log('Invalid user type');
            alert('오류가 발생해습니다. userType을 확인할 수 없음');
            return;
        }

        const {error} = validationSchema.validate(data);
        if (error) {
            console.log(error);
            alert('입력값을 확인해주세요');
            return;
        }

        try {
            //I know. This is not fucking secure.
            //그래서 너가 뭘 할수있는데?
            const key = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArQMzx5rts2T4P3vPvP60Y7Q97vPTXo6alyxK+glJ4YZJOI6V/D1cnIzPVa+wcyq3Olli+BPR9DpAuzkkMKWgDlGDpF0jtRS/SFKRiSkc9ExklubfxJ7Wiy5AOVpLsvwdCb7YCbusxvf+z9XsTI51xl3pich/tmo+Zptd99jHaiCpOekryaaWpClW++6nFUUfg5ZZDlT7uxR7MPYey9F8v9pzlt9+7m5B2faTiv0gc1WUqeTpQD6vtiGqTjENvmFdDLWdC999drFHoHeH9fZp8erfcexHcZ1roPKM9ymvYtEamHS76ukW55y+jdq6mVnZTQzXILiBDt15LhZc5wQEYwIDAQAB";

            let data_result;
            const crypto_off = true;
            if (crypto_off || !window.crypto || !window.crypto.subtle) {
                alert('주의: 이 브라우저는 최신 보안 기능을 지원하지 않습니다.');
                //암호화 없이 전송
                data_result = {data: data, isEncrypted: false, userType: userType};
            } else {
                const publicKey = await crypto.subtle.importKey(
                    "spki",
                    Uint8Array.from(atob(key), c => c.charCodeAt(0)),
                    {
                        name: "RSA-OAEP",
                        hash: "SHA-256"
                    },
                    false,
                    ["encrypt"]
                );
                const encoder = new TextEncoder();
                const encrypted = await crypto.subtle.encrypt(
                    {
                        name: "RSA-OAEP"
                    },
                    publicKey,
                    encoder.encode(JSON.stringify(data))
                );

                let encryptedString = btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
                data_result = {data: encryptedString, isEncrypted: true, userType: userType}
            }


            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data_result)
            });

            const res_data = await response.json();

            if (response.status === 201) {
                console.log(response);
                if(res_data.isActivated) {
                    alert('회원가입이 완료되었습니다.');
                    location.href = '/sign-up';
                } else {
                    location.href = '/auth/sign-up/activate';
                }
            } else {
                alert('회원가입에 실패했습니다');
                console.log(res_data);
                alert(res_data.error);
            }
        } catch (e) {
            console.error(e);
            alert('회원가입에 실패했습니다. 예기치 않은 오류');
        }

    });
});