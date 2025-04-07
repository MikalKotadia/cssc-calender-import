console.log("Content script injected!");

// You can interact with the DOM here

const body = document.querySelector('body');
if (body) {
    const message = document.createElement('div');
    const url = document.URL;
    message.textContent = `this is comming from ${url}`;

    body.prepend(message);

    message.innerText = "hello from cssc.";
}
