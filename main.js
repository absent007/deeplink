const form = document.querySelector('form');
const input = document.querySelector('input[name="url"]');
const resultDiv = document.querySelector('#result');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = input.value;
  
  // Send the long URL to the server to be shortened
  const response = await fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  
  // Display the shortened URL to the user
  const data = await response.json();
  const shortenedUrl = window.location.origin + '/' + data.id;
  resultDiv.innerHTML = `<a href="${shortenedUrl}">${shortenedUrl}</a>`;
});
