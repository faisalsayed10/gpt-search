const API_KEY = "YOUR_API_KEY"; // Change this line

function createButton(symbol, name) {
  const btn = document.createElement('button');
  btn.style.margin = '0 0.5em';

  const icon = document.createElement('span');
  icon.innerText = symbol;
  icon.style.marginRight = '0.5em';
  icon.style.fontWeight = 'bold';

  btn.append(icon);
  btn.append(name);
  btn.id = "modalBtn"

  return btn;
}

function queryParams() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

const query = queryParams().q.replace(/\+/g, ' ');
const button = createButton('🤖', 'GPT-3');
document.querySelector('[aria-current="page"]').parentElement.appendChild(button);

const modalHtml = `<button id="myBtn">Open Modal</button>

<!-- The Modal -->
<div id="modal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <p class="modal-content-text">Loading...</p>
  </div>

</div>`;

document.body.innerHTML += modalHtml;

const modal = document.querySelector("#modal");
const content = document.querySelector(".modal-content-text")
const btn = document.querySelector("#modalBtn");
const span = document.querySelector(".close");

btn.onclick = () => {
  modal.style.display = "block";
  getAIResults();
}

span.onclick = () => {
  modal.style.display = "none";
}

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
}

function getAIResults() {
  fetch(`https://api.openai.com/v1/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ // Change these options according to your wish
      prompt: query,
      model: "text-davinci-003",
      max_tokens: 1024,
      frequency_penalty: 1,
      temperature: 0
    })
  })
  .then(response => response.json())
  .then(response => {
    console.log(response);
    if (response.error) {
      content.innerHTML = response.error.message;
      regenerateBtn();
    } else {
      const gpt3Output = response.choices[response.choices.length - 1].text;
      content.innerHTML = gpt3Output;
      regenerateBtn();
    }
  })
  .catch(err => {
    console.error(err);
    content.innerHTML = err.message;
    regenerateBtn();
  });
}

const regenerateBtn = () => {
  const btn = document.createElement('button');
  btn.append("Regenerate");
  btn.onclick = () => {
    content.innerHTML = "Loading...";
    getAIResults();
  }

  content.appendChild(document.createElement("br"));
  content.appendChild(document.createElement("br"));
  content.appendChild(btn);
}

