import '../css/listBreedsComponent.css';
import ContentComponent from '../contentComponent/contentComponent.js';

class ListBreeds extends ContentComponent {
  constructor() {
    super();
    this.render();
  }

  async getFullList() {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    if (response.status === 404) {
      this.displayError('Page not found');
    }
    const data = await response.json();
    return data;
  }

  createListItem(title) {
    const item = document.createElement('div');
    item.classList.add('breed-list-item');
    item.innerHTML = title;
    document.querySelector('#content').appendChild(item);
  }
  displayList(results) {
    // a result.message egy object, amin végigmegyünk key:value páronként...

    for (const breed in results.message) {
      //  ha a value (ami egy tömb) hossza nem nulla

      if (results.message[breed].length != 0) {
        // akkor végimegyünk a többön és kiírjuk a fajtákat, az alfajtákkal együtt
        for (const subBreed of results.message[breed]) {
          // minden alfaj mögé odaírjuk a főfaj nevét pl:
          // boston buldog, french buldog

          this.createListItem(subBreed + ' ' + breed);
        }
      } else {
        this.createListItem(breed);
      }
    }
  }

  render() {
    const button = document.createElement('button');
    button.classList.add('list-button');
    button.innerHTML = 'List Breeds';
    // button html elemnek van onclick atributúma...
    button.onclick = () => {
      this.clearContent();
      this.getFullList().then(results => {
        // short circuit evaluation
        results && this.displayList(results);
      });

    };
    document.querySelector('#header').appendChild(button);

  }
}

export default ListBreeds;