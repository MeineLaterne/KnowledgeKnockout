import { Ajax } from './modules/ajax.js';

const form = document.getElementById('registrationUploadForm');
const textArea = document.getElementById('registrationContent');
const name = document.getElementById('name');
const email = document.getElementById('email');
const password = document.getElementById('password');

form.onsubmit = async e => {
    e.preventDefault();

    let errorString = '';

    let data = {
        content: textArea.value,
        name: name.value,
        email: email.value,
        password: password.value,
    };

    // validate input

    if (data.content === '') {
        errorString += "Bitte gib eine Frage ein!\n";
    }

    if (data.name === '') {
        errorString += "Bitte Name eingeben";
    }

    if (data.email === '') {
        errorString += "Bitte E-Mail eingeben";
    }

    if (data.password === '') {
        errorString += "Bitte Password eingeben";
    }

    if (errorString.length !== 0) {
        return alert(errorString);
    }

    try {
        const response = JSON.parse(await Ajax.post('/registration', JSON.stringify(data), { 'Content-Type': 'reistration/json' }));

        if (response.success === true) {
            let reset = confirm('Hat geklappt! Formular resetten?');

            if (reset === true) {
                textArea.value = '';
                name.value = '';
                email.value = '';
                password.value = '';
            }
        } else {
            throw response.error;
        }
    } catch (error) {
        alert(`Ein Fehler ist aufgetreten: ${error}`);
    }


};