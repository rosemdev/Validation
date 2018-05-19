import {Validation} from './Validation.js';

document.addEventListener("DOMContentLoaded", function (event) {
    console.log("DOM fully loaded and parsed");

    let validation = new Validation('form', {
        passwordSelector: "input[type=password]",
        confirmPassSelector: "[name=confirmPassword]",
        errorMessages: {
            valueMissing: field => `The field ${field.name} is required, please fill it!`
        }
    });

});
