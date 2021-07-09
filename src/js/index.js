require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
import CodeMirror from 'codemirror';

document.addEventListener('DOMContentLoaded', () => {

    const saveButton = document.querySelector('.save__button');
    const deleteButton = document.querySelector('.delete__button');
    const presetsList = document.querySelector('.presets-block__list');
    const downloadButton = document.querySelector('.btn-download-preset__button');
    
    const downloadImg = document.querySelector('.download-img');
    const spinner = document.getElementById("spinner");

    let doc = document.querySelector('#test').contentWindow.document;
    const presetTitle = document.querySelector('.block__code-menu-preset-title');


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
      });
    };

    refreshPresetsList();

    saveButton.addEventListener('click', () => {
        const presetHTML = doc.firstChild.innerHTML;
        const formData = new FormData();
        formData.append('html', presetHTML);
        formData.append('title', presetTitle.value);
        formData.append('action', 'save');
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

    downloadButton.addEventListener('click', e => {
        e.preventDefault();
        spinner.removeAttribute('hidden');
        downloadImg.style.display = 'none';

        const presetHTML = doc.firstChild.innerHTML;
        const formData = new FormData();
        formData.append('html', presetHTML);
        const options = {
            method: 'POST',
            body: formData,
        };
        fetch('http://185.251.90.104/img-gen/api-generate-img.php', options)
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

    

    

});




