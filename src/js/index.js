import html2canvas from 'html2canvas'

document.addEventListener('DOMContentLoaded', () => {

    const targetArea = document.querySelector('.preview__text');
    const targetTextArea = document.querySelector('.preview__text-target');
    const button = document.querySelector('.preview__button');

    const controllSize = document.querySelector('#size');

    const downloadInput = document.querySelector('#download-input')

    const resultBlock = document.querySelector('.result-block');
    const textInput = document.querySelector('.settings__input');

    const imgFromInput = document.querySelector('#img-from-input');


    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
    
    async function Main() {
       const file = downloadInput.files[0];
       console.log(await toBase64(file));
       imgFromInput.setAttribute('src', await toBase64(file))
    }

    downloadInput.addEventListener('input', () => {
        Main();
    });

    textInput.addEventListener('input', (e) => {
        targetTextArea.innerText = textInput.value;
    });

    controllSize.addEventListener('input', (e) => {
        imgFromInput.style.height = `${controllSize.value}%`;
    });


    button.addEventListener('click', () => {
        html2canvas(targetArea)
        .then(function (canvas) {
            const canvasImg = canvas.toDataURL("image/jpg");
            console.log(canvas)
            resultBlock.innerHTML += `<img src="${canvasImg}" style="border: 1px solid #000000" alt="">`
            resultBlock.style.display = 'block';
        });

    });

    
});




