import '../css/contentComponent.css';

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

}