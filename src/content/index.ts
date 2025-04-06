console.log("Content script injected!");

// You can interact with the DOM here
const body = document.querySelector('body');
if (body) {
  const message = document.createElement('div');
  message.textContent = 'Hello from my Chrome Extension!';
  body.prepend(message);

}
