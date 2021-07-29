export const displayPopup = (selector, title, text, action, actionFunction, parameter) => {
    selector.children[0].innerText = title;
    selector.children[1].innerText = text;

    const buttonCencel = selector.lastElementChild.children[0]
    const buttonAccept = selector.lastElementChild.lastElementChild;

    switch (action) {
        case 'post':
            buttonAccept.innerText = 'Добавить';
            buttonAccept.style.color = '#2ECC71';

            break;
        case 'remove post':
            buttonAccept.innerText = 'Изъять';
            buttonAccept.style.color = '';

            break;
        case 'delete print':
            buttonAccept.innerText = 'Удалить';
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