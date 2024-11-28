// Пример использования
const data = {
    name    : "Анна",
    count   : 2,
    messages: [
        "Сообщение 1",
        "Сообщение 2",
        "Сообщение 3"
    ]
};

const renderer = new TemplateRenderer('template', data);
const result   = renderer.render();

document.getElementById('output').insertAdjacentHTML('beforeend', result);