import '../css/contentComponent.css';
import yall from 'yall-js';
import preloading from '../img/preloading.gif';


export default class ContentComponent {


  // ha van már kép megjelenítve akkor töröljök
  clearContent() {
    const content = document.querySelector('#content');
    content.innerHTML = '';
  }

  clearErrors() {
    const errors = document.querySelector('.errors');
    errors.innerHTML = '';
  }
  // megjelenít egy hibaüzenetet a felhasználónak
  displayError(message) {
    this.clearErrors();
    const popupMessage = document.createElement('h2');
    popupMessage.classList.add('error-message');
    popupMessage.innerHTML = message;

    document.querySelector('.errors').appendChild(popupMessage);
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

  handleContentDisplay(searchTerm) {
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
  }

  setSearchTerm(term) {
    document.querySelector('#dogSearchInput').value = term;
  }

}