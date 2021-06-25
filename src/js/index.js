//import html2canvas from 'html2canvas';
import CodeMirror from 'codemirror';

document.addEventListener('DOMContentLoaded', () => {

    //const targetArea = document.querySelector('.preview__text');
    const saveButton = document.querySelector('.preview__button');
    const refreshPresetsButton = document.querySelector('.presets-block__button-refresh');
    const presetsList = document.querySelector('.presets-block__list');

    //const resultBlock = document.querySelector('.result-block');

    let doc = document.querySelector('#test').contentWindow.document;
    const presetTitle = document.querySelector('#title-text');

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        styleActiveLine: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
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

    saveButton.addEventListener('click', () => {
        //console.log(doc.activeElement.innerHTML)
            const presetHTML = doc.activeElement.innerHTML;
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
            .then(res => console.log(res))
        
            /* === Выгрузка изображения с помощью html2canvas ====
        
        html2canvas(doc, {
            //useCORS: true,
            scale:20
        })
        .then(function (canvas) {
            const canvasImg = canvas.toDataURL("image/jpg");
            console.log(canvas)
            resultBlock.innerHTML += `<img src="${canvasImg}" style="border: 1px solid #000000" alt="">`
            resultBlock.style.display = 'block';
        

        });
        
    */
    });

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
        })

    refreshPresetsButton.addEventListener('click', () => {
        //console.log(doc.activeElement.innerHTML)
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
        })
    })

    presetsList.addEventListener('click', e => {
        if (e.target.type === "radio") {
            console.log(e.target);

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
            })
        }
        
    })

    

    

});




