export default class FormValidator {
  _formInputList
  _buttonSubmitElement
  constructor(validationConfig, formElement) {
    this._validationConfig = validationConfig;
    this._formElement = formElement;
    this._formInputList = Array.from(this._formElement.querySelectorAll(`${this._validationConfig.inputSelector}`));
    this._buttonSubmitElement = this._formElement.querySelector(`${this._validationConfig.buttonSubmitSelector}`);
  }


  _setEventListeners() {

    this._toggleButtonSubmit();
  
    this._formInputList.forEach((formInputElement) => {
      formInputElement.addEventListener('input', () => {
        this._checkInputValidity(formInputElement);
        this._toggleButtonSubmit();
      })
    })
  }


  _disableButton() {
    this._buttonSubmitElement.classList.add(`${this._validationConfig.inactiveButtonClass}`);
    this._buttonSubmitElement.setAttribute('disabled', 'disabled');
  }


  _toggleButtonSubmit() {
    if(this._hasInvalidInput()) {
      this._disableButton();
    }
    else {
      this._buttonSubmitElement.classList.remove(`${this._validationConfig.inactiveButtonClass}`);
      this._buttonSubmitElement.removeAttribute('disabled', 'disabled');
    }
  }


  _hasInvalidInput() {
    return this._formInputList.some(function (formInputElement) {
      return !formInputElement.validity.valid;
    })
  }


  _checkInputValidity(formInputElement) {
    if (!formInputElement.validity.valid) {
      this._showErrorMessage(formInputElement, formInputElement.validationMessage);
    } 
    else {
      this._hideErrorMessage(formInputElement);
    }
  }


  _showErrorMessage(formInputElement, errorMessage) {
    const errorMessageElement = this._formElement.querySelector(`.${formInputElement.id}-error`);
  
    errorMessageElement.classList.add(`${this._validationConfig.errorClass}`);
    errorMessageElement.textContent = errorMessage;
    formInputElement.classList.add(`${this._validationConfig.inputErrorClass}`);
  }
  

  _hideErrorMessage(formInputElement) {
    const errorMessageElement = this._formElement.querySelector(`.${formInputElement.id}-error`);
  
    errorMessageElement.classList.remove(`${this._validationConfig.errorClass}`);
    errorMessageElement.textContent = "";
    formInputElement.classList.remove(`${this._validationConfig.inputErrorClass}`);
  }


  resetFormValidation() {
    this._formInputList.forEach((formInputElement) => this._hideErrorMessage(formInputElement));
    
    this._disableButton();
  }


  enableValidation() {
    this._setEventListeners();
  }
}