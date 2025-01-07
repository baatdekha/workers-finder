let container = document.querySelector('.card-container')

function addCard(name, village, occupation, contact,imgSrc) {
  let card = document.createElement('div')
  card.className = 'card'
  card.innerHTML = `<img src="${imgSrc}" alt="Worker Image" class="worker-image" onerror="this.onerror=null; this.src='avatar.jpg';">
<h3 class="worker-name">${name}<br> (${village})</h3><h4 class="occupation">${occupation}</h4><a href="tel:${contact}"><button class="call-button" >Call Me</button></a>`

  container.appendChild(card)
}

async function fetchCSVData() {
  const sheetId = '19UfWNrAp0bf3VI32vo9SAbMf0poM2JEu';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

  try {
    const response = await fetch(url);
    const csv = await response.text();
    //const rows = csv.split('\n').map(row => row.split(','));
    const rows = csv.split('\n').map(row =>
      row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim()))
    // console.log(rows)

    rows.forEach((row,i) => {
      let [name,village,occupation,contact,image] = row
      //console.log({name,village,occupation,contact,image})
      if (i==0) {
        return
      }
      addCard(name,village,occupation,contact,image)
    });
  } catch (error) {
    console.error('Error fetching CSV data:', error);
  }
}

const header = document.querySelector("header");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
