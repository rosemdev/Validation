function Validation() {
    let password = document.querySelector('input[type=password]');
    let confirmPassword = document.getElementById("confirmPass");

    let form = document.forms[0];
    form.setAttribute('novalidate', true);

    console.log(form.querySelector("input").validity);

    form.addEventListener('focusout', function (event) {

        // console.log(event.target);

        // Validate the common fields
        let errorMessage = defineErrorMessage(event.target);

        if (errorMessage) {
            showErrorMessage(errorMessage, event.target);
        } else {
            removeError(event.target);
        }

        if (event.target === password && confirmPassword.value !== password.value) {
            errorMessage = defineErrorMessage(confirmPassword);

            if (errorMessage) {
                showErrorMessage(errorMessage, confirmPassword);
            } else {
                removeError(confirmPassword);
            }
        }
    });


}

document.addEventListener('submit', function (event) {
    let form = document.forms[0];
    console.log('test');

    let fields = form.elements;
    let error, hasError;

    for (let field of fields) {
        console.log(field);
        error = defineErrorMessage(field);
        console.log(error);

        if (error) {
            showErrorMessage(error, field);
            if (!hasError) {
                hasError = field;
            }
        }
    }

    if (hasError) {
        event.preventDefault();
        hasError.focus();
    }


});

function defineErrorMessage(field) {
    // Don't validate submits, buttons, file and reset inputs, and disabled fields
    if (field.disabled || ['file', 'reset', 'submit', 'button'].includes(field.type)) return;

    event.target.checkValidity();

    ///////TODO
    let password = document.querySelector('input[type=password]');
    let confirmPassword = document.getElementById("confirmPass");

    if (field === confirmPassword && confirmPassword.value !== password.value) { //TODO
        console.log(confirmPassword.value);

        return 'The password don*t match! Please enter the same'
    }
    ////////////

    let validity = field.validity;

    // If common rules are valid - check specific rules
    if (validity.valid) {
        return;
    }

    let errorMessage;

    if (validity.valueMissing && field.value === "") {
        return errorMessage = 'This field is required, please fill it!';
    }

    if (validity.typeMismatch) {
        errorMessage = `Please, input data in correct format for required type ${field.getAttribute('type')} `;

        if (field.type === "tel") {
            console.log(field.value);
            console.log(field.validity.valid);
            errorMessage = `Please, use required format for ${field.getAttribute('type')}`

        }

        return errorMessage;
    }


    if (validity.tooShort) {
        return errorMessage = `Please enter minimum ${field.getAttribute('minLength')} symbols`;
    }

    if (validity.tooLong) {
        return errorMessage = `Please enter maximum ${field.getAttribute('maxLength')} symbols`;
    }

    if (validity.stepMismatch) {
        return errorMessage = `Please follow step ${field.getAttribute('step')}`;
    }

    if (validity.rangeUnderflow) {
        return errorMessage = `Please use number that no less than ${field.getAttribute('min')}`
    }

    if (validity.rangeOverflow) {
        return errorMessage = `Please use number that no more than ${field.getAttribute('max')}`
    }

    if (validity.patternMismatch) {
        switch (field.type) {
            case 'password':
                console.log(field.value);
                errorMessage = 'Minimum eight characters, at least one letter and one number';
                console.log(field.checkValidity());
                break;
            case 'tel':
                console.log(field.value);
                console.log(field.validity.valid);
                console.log(field.validity.valueMissing);
                errorMessage = 'Please, input only numbers';
                break;
            case 'email':
                errorMessage = 'Please use standard email format e.g. jon.doe@mail.com';
                break;
            default:
                if (field.hasAttribute('title')) {
                    errorMessage = `Please follow requested format: ${field.getAttribute('tile')}`
                }
        }

        return errorMessage;
    }

    // return errorMessage ='The value you entered for this field is invalid.';


}


function showErrorMessage(message, input) {
    input.classList.add('error');

    let id = input.id || input.name;
    let messageElement = document.querySelector('.error-message#error-for-' + id);

    if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.classList.add('error-message');
        messageElement.id = 'error-for-' + id;
        input.parentNode.appendChild(messageElement);
    }

    messageElement.textContent = message;

}


// function extendedValidation(validationRequirements, field) {
//     field.classList.add('extended-validation');
//
//     if (!validationRequirements.pattern.test(field.value)) {
//
//         showErrorMessage(validationRequirements.errorMessage, field);
//         console.log(validationRequirements.errorMessage);
//
//     } else {
//         removeError(field);
//     }
//
// }


function removeError(input) {
    let id = input.id || input.name;
    let messageElement = document.querySelector('.error-message#error-for-' + id);

    if (messageElement) {
        input.classList.remove('error');
        messageElement.classList.add('inactive');
        messageElement.addEventListener('animationend', function () {
            messageElement.remove();
        });
    }
}

let validation = new Validation();