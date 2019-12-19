import { Ajax } from './modules/ajax.js';

let form = document.getElementById('questionUploadForm');
let textArea = document.getElementById('questionContent');
let wrongAnswer01 = document.getElementById('answer_01');
let wrongAnswer02 = document.getElementById('answer_02');
let wrongAnswer03 = document.getElementById('answer_03');
let correctAnswer = document.getElementById('answer_04');
let topicBlockSelect = document.getElementById('topicBlock');
let topicSelect = document.getElementById('topic');

form.onsubmit = async function (e) {
    e.preventDefault();

    let data = {
        content: textArea.value,
        wrongAnswer01: wrongAnswer01.value,
        wrongAnswer02: wrongAnswer02.value,
        wrongAnswer03: wrongAnswer03.value,
        correctAnswer: correctAnswer.value,
        topicBlockId: topicBlockSelect.options[topicBlockSelect.selectedIndex].value,
        topicId: topicSelect.options[topicSelect.selectedIndex].value
    };

    try {
        const response = await Ajax.post('/add-question', JSON.stringify(data), { 'Content-Type': 'application/json' });

        if (response.success === true) {
            let reset = confirm('Hat geklappt! Formular resetten?');

            if (reset === true) {
                textArea.value = '';
                wrongAnswer01.value = '';
                wrongAnswer02.value = '';
                wrongAnswer03.value = '';
                correctAnswer.value = '';
            } 
        } else {
            throw response.error;
        }
    } catch (error) {
        alert(`Ein Fehler ist aufgetreten: ${error}`);
    }

    
};