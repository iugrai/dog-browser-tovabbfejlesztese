import '../css/searchImageComponent.css';
import ContentComponent from '../contentComponent/contentComponent.js';
import yall from 'yall-js';
import preloading from '../img/preloading.gif';

class SearchImage extends ContentComponent {
  constructor() {
    super();
    // példányosításkor, megjelenítjük a keresőt automatikusan
    this.render();
  }

  // Ez a metódus letölti az adatot az API-ról
  async getImages(dogbreed) {

    if (!dogbreed) {
      this.displayError('Nem lett beírva semmi a keresőbe, nem tudunk keresni!');
      // megállítjuk a getImages függvény futását
      return;
    }
    let urlString = '';
    dogbreed = dogbreed.split(' ');
    // a dogbreed változó mostmnár egy tömb
    if (dogbreed.length === 1) {
      urlString = `https://dog.ceo/api/breed/${dogbreed[0].toLowerCase()}/images`;
    } else if (dogbreed.length === 2) {
      urlString = `https://dog.ceo/api/breed/${dogbreed[1].toLowerCase()}/${dogbreed[0].toLowerCase()}/images`;
    }
    const response = await fetch(urlString);

    const data = await response.json();
    // a data változó egy objecteket tartalmazó tömb
    return data;
  }

  // megjelenít egy képet véletlenszerűen
  displayImages(data) {

    const image = document.createElement('img');
    image.classList.add('lazy');
    image.src = preloading;

    {/* <img src="" alt="" class="src"> */ }
    // a data.message tömbből egy véletlenszerű elemet kiválasztunk
    image.dataset.src = data.message[Math.floor(Math.random() * data.message.length)];
    document.querySelector('#content').appendChild(image);
    // console.log(data);
    yall({
      events: {
        load: event => {
          if (event.target.nodeName == 'IMG' && !event.target.classList.contains('lazy')) {
            event.target.classList.add('yall-loaded');
          }
        }
      }
    });
  }



  // megjeleníti a keresőt:
  render() {
    const markup = `
      <form class="dog-search" >
        <span class="search-icon"></span>
        <input type="text" id="dogSearchInput">
        <input type="text" id="imageNumberInput" placeholder="1">
          <button>Search</button>
</form>
    `;
    document.querySelector('#header').insertAdjacentHTML('beforeend', markup);
    // console.log(this);
    // az arrow functionnek nincs saját kulcsszava, tehát az arrow function-ön belül a this ugyanazt fogja jeleníteni mint az azon kívül (a class-t amiben vagyunk)
    document.querySelector('.dog-search button').addEventListener('click', (event) => {
      event.preventDefault();
      const searchTerm = document.querySelector('#dogSearchInput').value;
      // 2. feladat
      let count;
      let imageNumberValue = Math.floor(parseInt(document.querySelector('#imageNumberInput').value));
      if (isNaN(imageNumberValue) === true || imageNumberValue < 1) {
        count = 1;
      }
      else {
        count = imageNumberValue;
      }

      // mivel a getImages egy async method, ezért ez is promise-al tér vissza
      // emiatt, a promise object-en amit a getImages visszaad, elérhető a .then() metódus
      // a then metódus bemeneti paramétere egy callback function, ami akkor fut le amikor
      // a promise beteljesül akkor jön létre a data amit visszad a getImages metódus
      // ha az arrow functionben csak egy bemeneti paraméter van, akkor a zárójel elhagyható
      this.getImages(searchTerm).then((result) => {
        // ha csak egy dolgot kell csinálni az if block-ban, akkor a kódblokk {} elhagyható
        if (result) this.displayImages(result);
        if (result) {
          this.clearErrors();
          this.clearContent();
          for (let i = 1; i <= count; i++) {
            this.displayImages(result);
          }
        }
      });


    });
  }
}

export default SearchImage;
