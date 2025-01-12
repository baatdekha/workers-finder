let container = document.querySelector('.card-container');
let filterContainer = document.getElementById('occupation-filter');
let workersData = []; // Store the workers' data

function addCard(name, village, occupation, contact, imgSrc) {
  let card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
      <div class='worker-image-cover'>
        <img src="${imgSrc}" alt="Worker Image" class="worker-image" onerror="this.onerror=null; this.src='avatar.jpg';">
      </div>
      <h3 class="worker-name">${name}<br> (${village})</h3>
      <h4 class="occupation">${occupation}</h4>
      <a href="tel:${contact}">
        <button class="call-button">Call Me</button>
      </a>
    `;
  container.appendChild(card);
}

function filterCards(occupation) {
  container.innerHTML = '';
  workersData.forEach(({ name, village, occupation: workerOccupation, contact, imgSrc }) => {
    if (occupation === 'all' || workerOccupation === occupation) {
      addCard(name, village, workerOccupation, contact, imgSrc);
    }
  });
}

async function fetchCSVData() {
  const sheetId = '1zeaDjkbOtWjIxLx-YxZKHA0b1mSuSZsd2mgcw5C_5Pk';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  try {
    const response = await fetch(url);
    const csv = await response.text();
    const rows = csv.split('\n').map(row => row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim()));

    let occupations = new Set();

    rows.forEach((row, i) => {
      if (i === 0) return; // Skip header row
      let [timestamp, name, contact, village, occupation, image] = row;
      let imgSrc = `images/${name.replaceAll(' ', '-')}.jpg`;

      workersData.push({ name, village, occupation, contact, imgSrc });
      occupations.add(occupation);
    });

    // Clear previous filters to avoid duplication
    filterContainer.innerHTML = '';

    // Create "All" radio button
    createRadioButton('all', 'All', true);

    // Create radio buttons for each occupation
    occupations.forEach(occupation => {
      createRadioButton(occupation, occupation);
    });

    filterCards('all'); // Display all cards initially
  } catch (error) {
    console.error('Error fetching CSV data:', error);
  }
}

function createRadioButton(value, labelText, isChecked = false) {
  let label = document.createElement('label');
  let checked = isChecked ? 'checked' : '';
  label.innerHTML = `
      <input type="radio" name="occupation" value="${value}" ${checked}>
      <span>${labelText}</span>
    `;
  filterContainer.appendChild(label);

  // Add event listener to filter cards when a radio button is selected
  label.querySelector('input').addEventListener('change', () => {
    filterCards(value);
  });
}

// Fetch data once on page load
fetchCSVData();

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});