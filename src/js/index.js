require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
import CodeMirror from 'codemirror';

document.addEventListener('DOMContentLoaded', () => {

    const saveButton = document.querySelector('.save__button');
    const deleteButton = document.querySelector('.delete__button');
    const createPresetButton = document.querySelector('.create__button');
    const presetsList = document.querySelector('.presets-block__list');

    let doc = document.querySelector('#test').contentWindow.document;
    const presetTitle = document.querySelector('.block__code-menu-preset-title');

    const sideBar = document.querySelector('.settings');
    const sideBarToggleButton = document.querySelector('#toggle-menu-btn')


    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        theme: 'ayu-dark',
        mode: 'htmlmixed',
      });
      
      doc.open();
      doc.write(editor.getValue());
      doc.close();
  
      editor.on("change", () => {
          doc.open();
          doc.write(editor.getValue());
          doc.close();
      })

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

          presetsList.lastElementChild.click();
      });
    };

    refreshPresetsList();

    createPresetButton.addEventListener('click', () => {

        const defaultHtml = `<head>
    <!-- Подключаемые шрифты <link> -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
</head>
<body>
    <section>
        <!-- Стили -->
        <style>
            .frame {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            h1 {
                color: #fff;
                font-size: 2em;
                font-family: 'Montserrat', sans-serif;    
                margin-bottom: 0;
            }
        </style>
                        
        <!-- HTML -->
        <div class="frame">                    
            <h1>Текст с городом [city]</h1>
        </div>
    </section>
</body>`;

        const formData = new FormData();
        formData.append('html', defaultHtml);
        formData.append('title', 'Безымянный пресет');
        formData.append('action', 'save');
        const options = {
            method: 'POST',
            body: formData,
        };
        fetch('./index.php', options)
        .then(res => res.text())
        .then(res => {
            console.log('Создан пресет', res);

            refreshPresetsList();
        })
    });

    saveButton.addEventListener('click', () => {
        const presetHTML = doc.firstChild.innerHTML;
        const presetId = presetTitle.dataset.idx;

        const formData = new FormData();
        formData.append('html', presetHTML);
        formData.append('title', presetTitle.value);
        formData.append('id', presetId);
        formData.append('action', 'update');

        const options = {
            method: 'POST',
            body: formData,
        };
        fetch('./index.php', options)
        .then(res => res.text())
        .then(res => {
            console.log(res);
            refreshPresetsList();
        })
    });

    deleteButton.addEventListener('click', () => {
        const presetId = presetTitle.dataset.idx;
        
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', presetId);
        const options = {
          method: 'POST',
          body: formData,
        };
        fetch('./index.php', options)
        .then(res => res.text())
        .then(res => {
            console.log(res);
            refreshPresetsList();
        })
    });

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
                doc.open();
                doc.write(res[0].html);
                doc.close();

                editor.setValue(res[0].html)
                presetTitle.value = res[0].title
                presetTitle.dataset.idx = res[0].id
            })
        }
        
    });

    // Скрыть/показать сайдбар
    sideBarToggleButton.addEventListener('click', () => {
        sideBar.classList.toggle('hidden');

        if (sideBar.classList.contains('hidden')) {
            sideBarToggleButton.querySelector('img').setAttribute('src', '../img/burger-btn.svg');
        } else {
            sideBarToggleButton.querySelector('img').setAttribute('src', '../img/close-btn.svg');
        }
    });

    

});




