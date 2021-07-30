export const displayPopup = (selector, title, text, action, actionFunction, parameter) => {
    // Очистка старых кнопок
    selector.removeChild(selector.lastElementChild);

    selector.children[0].innerText = title;
    selector.children[1].innerText = text;

    const popupAcceptButtons = document.createElement('div');
    popupAcceptButtons.classList.add('popup-accept__buttons');

    const buttonCencel = document.createElement('button');
    buttonCencel.classList.add('popup-accept__button', 'popup-accept__button-cancel');
    buttonCencel.textContent = 'Отмена';
    popupAcceptButtons.append(buttonCencel);

    const buttonAccept = document.createElement('button');
    buttonAccept.classList.add('popup-accept__button', 'popup-accept__button-accept')
    popupAcceptButtons.append(buttonAccept);

    selector.append(popupAcceptButtons);

    switch (action) {
        case 'post':
            buttonAccept.textContent = 'Добавить';
            buttonAccept.style.color = '#2ECC71';

            break;
        case 'remove post':
            buttonAccept.textContent = 'Изъять';
            buttonAccept.style.color = '';

            break;
        case 'delete print':
            buttonAccept.textContent = 'Удалить';
            buttonAccept.style.color = '';

            break;
        default:
            break;
    };

    buttonAccept.addEventListener('click', () => {
        actionFunction(parameter);
        selector.classList.add('hide');
    }, {once: true});
    buttonCencel.addEventListener('click', () => selector.classList.add('hide'), {once: true});
    
    selector.classList.remove('hide');
};