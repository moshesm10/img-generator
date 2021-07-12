const presetsList = document.querySelector('.presets-block__list');
const cityText = document.querySelector('#city');
const imgText = document.querySelector('#img');
const generatedImgsArea = document.querySelector('.imgs');
const generateImgBtn = document.querySelector('.generate-img');
const spinner = document.getElementById("spinner");

presetsList.addEventListener('click', e => {
    if (e.target.type === "radio") {

        const formData = new FormData();
        formData.append('action', 'load');
        formData.append('id', e.target.value);
        const options = {
            method: 'POST',
            body: formData,
        };
        fetch('./index.php', options)
        .then(res => res.json())
        .then(res => {
            console.log('html', res[0].html);
            console.log('title', res[0].title);
            console.log('title', res[0].id);
        })
    }
});

//console.log(document.querySelector('input[type="radio"]:checked'));

// Генерация изображений
generateImgBtn.addEventListener('click', () => {

    if (!document.querySelector('input[type="radio"]:checked')) {
        alert('Выбери пресет для генерации изображения');
    } else {

        spinner.removeAttribute('hidden');

        // загрузка html
        const formData = new FormData();
        formData.append('action', 'load');
        formData.append('id', document.querySelector('input[type="radio"]:checked').value);
        const options = {
            method: 'POST',
            body: formData,
        };
        fetch('./index.php', options)
        .then(res => res.json())
        .then(res => {
            const printValues = {
                city: cityText.value,
                img: imgText.value
            };
    
            // здесь POST запрос на генерацию изображений
            const formData = new FormData();
            formData.append('html', res[0].html);
            formData.append('print-values', JSON.stringify(printValues));
            formData.append('mode', 'preview');
            const options = {
                method: 'POST',
                body: formData
            };
            fetch('http://185.251.90.104/img-gen/api4-generate-img.php', options)
            .then(res => res.text())
            .then(res => {
                console.log('output text: ', res);
                generatedImgsArea.innerHTML = '';
                spinner.setAttribute('hidden', '');
    
                // Вывод изображений
                generatedImgsArea.innerHTML += `<img src="${res}" alt="Принт">`;
                
            });
        });
    };

});

// Обновить список пресетов
const refreshPresetsList = () => {
    const formData = new FormData();
    formData.append('action', 'refresh');
    const options = {
        method: 'POST',
        body: formData,
    };
    fetch('./index.php', options)
    .then(res => res.json())
    .then(res => {
        presetsList.innerHTML = '';
        res.forEach(preset => {
            presetsList.innerHTML += `
                <input type="radio" id="preset${preset.id}" name="preset" value="${preset.id}">
                <label for="preset${preset.id}">${preset.title}</label>
            `;
        });
    });
  };

  refreshPresetsList();
