export class Validation {

    constructor(form, options) {
        this.options = {
            errorMessages: {
                valueMissing: () => 'This field is required, please fill it!',
                typeMismatch: field => `Please, input data in correct format for required type ${field.getAttribute('type')} `,
                tooShort: field => `Please enter minimum ${field.getAttribute('minLength')} symbols`,
                tooLong: field => `Please enter maximum ${field.getAttribute('maxLength')} symbols`,
                stepMismatch: field => `Please follow step ${field.getAttribute('step')}`,
                rangeOverflow: field => `Please use number that no more than ${field.getAttribute('max')}`,
                rangeUnderflow: field => `Please use number that no less than ${field.getAttribute('min')}`,
                patternMismatch: field => `Please follow requested format: ${field.getAttribute('title')}`,
                badInput: () => 'Please enter a number.',
                //advanced messages
                passwordSecurity: () => 'Minimum eight characters, at least one letter and one number',
                passwordCoincidence: () => 'The password don*t match! Please enter the same',
                invalidEmail: () => 'Please use standard email format e.g. jon.doe@mail.com',
                invalidNumberField: () => 'Please, input only numbers',
                noTitle: () => 'Please, use correct format',
                general: () => 'The value you entered for this field is invalid.'
            }
        };

        Object.assign(this.options.errorMessages, options.errorMessages || {});

        if (typeof(form) === 'string') {
            this.form = document.querySelector(form);
        } else {
            this.form = form;

        }

        this.passwordFiled = this.form.querySelector(options.passwordSelector);
        this.ConfPasswordFiled = this.form.querySelector(options.confirmPassSelector);

        //add form identificator && remove native browser validation
        this.form.classList.add('validation');
        this.form.setAttribute('novalidate', true);

        this.form.addEventListener('focusout', this.validate.bind(this));
        document.addEventListener('submit', this.onSubmit.bind(this));

    }


    validate(event) {
        this.toggleError(event.target);

        if (event.target === this.passwordFiled && this.ConfPasswordFiled.value !== this.passwordFiled.value) {
            this.toggleError(this.ConfPasswordFiled);
        }


    }

    _getErrorMessageElement(inputElement) {
        return this.form.querySelector('.error-message#error-for-' + (inputElement.id || inputElement.name))
    }

    toggleError(inputElement) {
        let errorMessage = this.defineErrorMessage(inputElement);

        if (errorMessage) {
            this.showErrorMessage(errorMessage, inputElement);
        } else {
            this.removeError(inputElement);
        }
    }

    defineErrorMessage(field) {

        // Don't validate submits, buttons, file and reset inputs, and disabled fields
        if (field.disabled || ['file', 'reset', 'submit', 'button', 'textarea'].includes(field.type)) return;

        field.checkValidity();


        if (field === this.ConfPasswordFiled && this.ConfPasswordFiled.value !== this.passwordFiled.value) {

            return this.options.errorMessages.passwordCoincidence(field);
        }


        let validity = field.validity;


        // If field is valid - do nothing
        if (validity.valid) {
            return;
        }

        let errorMessage;

        if (validity.badInput) {
            return this.options.errorMessages.badInput(field);
        }

        if (validity.valueMissing) {
            return this.options.errorMessages.valueMissing(field);
        }

        if (validity.typeMismatch) {
            return this.options.errorMessages.typeMismatch(field);
        }

        if (validity.tooShort) {
            return this.options.errorMessages.tooShort(field);
        }

        if (validity.tooLong) {
            return this.options.errorMessages.tooLong(field);
        }

        if (validity.stepMismatch) {
            return this.options.errorMessages.stepMismatch(field);
        }

        if (validity.rangeOverflow) {
            return this.options.errorMessages.rangeOverflow(field);
        }

        if (validity.rangeUnderflow) {
            return this.options.errorMessages.rangeUnderflow(field);
        }


        if (validity.patternMismatch) {
            switch (field.type) {
                case 'password':
                    errorMessage = this.options.errorMessages.passwordSecurity(field);
                    break;
                case 'tel':
                    errorMessage = this.options.errorMessages.invalidNumberField(field);
                    break;
                case 'email':
                    errorMessage = this.options.errorMessages.invalidEmail(field);
                    break;
                case 'number':
                    errorMessage = this.options.errorMessages.invalidNumberField(field);
                    break;
                default:
                    if (field.hasAttribute('title')) {
                        errorMessage = this.options.errorMessages.patternMismatch(field);
                    } else {
                        errorMessage = this.options.errorMessages.noTitle(field);
                    }
            }

            return errorMessage;
        }

        return this.options.errorMessages.general(field);

    }


    showErrorMessage(message, inputElement) {

        inputElement.classList.add('error');

        let messageElement = this._getErrorMessageElement(inputElement);

        if (!messageElement) {
            messageElement = document.createElement('p');
            messageElement.classList.add('error-message');
            messageElement.id = 'error-for-' + (inputElement.id || inputElement.name);
            messageElement.addEventListener('animationend', () => {
                if (!messageElement.classList.contains('active')) {
                    messageElement.style.display = 'none';
                }
            });
            inputElement.parentNode.appendChild(messageElement);
        }

        messageElement.style.display = '';
        messageElement.classList.add('active');
        messageElement.textContent = message;

    }


    removeError(inputElement) {

        let messageElement = this._getErrorMessageElement(inputElement);

        if (messageElement) {
            inputElement.classList.remove('error');
            messageElement.classList.remove('active');
        }

    }

    onSubmit(event) {
        if (!event.target.classList.contains('validation')) return;

        let fields = this.form.elements;
        let error, fieldHasError;

        for (let field of fields) {
            error = this.defineErrorMessage(field);

            if (error) {
                this.showErrorMessage(error, field);
                if (!fieldHasError) {
                    fieldHasError = field;
                }
            }
        }

        if (fieldHasError) {
            event.preventDefault();
            fieldHasError.focus();
        }
    }
}