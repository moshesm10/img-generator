const presetsList = document.querySelector('.presets-block__list');
const cityText = document.querySelector('#city');
const imgText = document.querySelector('#img');
const generatedImgsArea = document.querySelector('.imgs');
const generateImgBtn = document.querySelector('.generate-img');
const spinner = document.getElementById("spinner");

const getHtml = async (id) => {
    const formData = new FormData();
        formData.append('action', 'load');
        formData.append('id', id);
        const options = {
            method: 'POST',
            body: formData,
        };
        
        return await fetch('./index.php', options);
}

const getGeneratedImg = async (html, mode) => {
    const printValues = {
        city: cityText.value,
        img: imgText.value
    };

    const formData = new FormData();
    formData.append('html', html);
    formData.append('print-values', JSON.stringify(printValues));
    formData.append('mode', mode);
    const options = {
        method: 'POST',
        body: formData
    };
    return await fetch('http://185.251.90.104/img-gen/api4-generate-img.php', options);
};

// Генерация изображений
generateImgBtn.addEventListener('click', () => {

    if (!document.querySelector('input[type="radio"]:checked')) {
        alert('Выбери пресет для генерации изображения');
    } else {

        spinner.removeAttribute('hidden');

        // загрузка html
        getHtml(document.querySelector('input[type="radio"]:checked').value)
        .then(res => res.json())
        .then(res => {

            // здесь POST запрос на генерацию изображений
            getGeneratedImg(res[0].html, 'preview')
            .then(url => url.text())
            .then(url => {
                //console.log('output text: ', res);
                generatedImgsArea.innerHTML = '';
                spinner.setAttribute('hidden', '');
                console.log('Переменная на уровень выше (html)', res[0].html);
                
                // Вывод изображений
                generatedImgsArea.innerHTML += `
                    <img class="result-img" src="${url}" alt="Принт">
                    <div class="btn-download-preset">
                        <button class="btn-download-preset__button">
                            Скачать в большом разрешении
                            <img class="download-img" src="./img/download-btn.svg" alt="download button">
                            <div hidden id="spinner" class="btn-spinner"></div>
                        </button>
                    </div>    
                `;

                renderBigImgButton(res[0].html);
                
            });
        });
        
    };

});

// Скачать в большом разрешении
const renderBigImgButton = (html) => {
    const downloadButton = document.querySelector('.btn-download-preset__button');
    const downloadImg = document.querySelector('.download-img');

    downloadButton.addEventListener('click', e => {
        e.preventDefault();
        spinner.removeAttribute('hidden');
        downloadImg.style.display = 'none';

        getGeneratedImg(html, 'big')
        .then(res => res.text())
        .then(res => {
            spinner.setAttribute('hidden', '');
            downloadImg.style.display = '';
            
            const link = document.createElement('a');
            link.setAttribute('href', res);
            link.setAttribute('target', '_blank')
            link.click();

            console.log(res);
        })
    });
};

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
