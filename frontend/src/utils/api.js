import { requestInfo } from "./utils";

class Api {
  constructor({ baseUrl, headers }) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }


  _handleResponseData(res) {
    if (res.ok) {
      return res.json();    
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }


  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me` , {
      headers: this.headers
      })
      .then(res => this._handleResponseData(res))
  }


  getInitialCards() {
    return fetch(`${this.baseUrl}/cards` , {
        headers: this.headers
      })
      .then(res => this._handleResponseData(res))
  }


  addCard(name, link) {
    return fetch(`${this.baseUrl}/cards` , {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          name: name,
          link: link
        })
      })
      .then(res => this._handleResponseData(res))
  }


  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: this.headers
      })
      .then(res => this._handleResponseData(res))
  }

  
  updateUserInfo(name, about) {
    return fetch(`${this.baseUrl}/users/me` , {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
      .then(res => this._handleResponseData(res))
  }


  updateUserAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar` , {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify({
          avatar: avatar
        })
      })
      .then(res => this._handleResponseData(res))
  }
  

  updateCardLike(cardId, isLiked) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
        method: isLiked ? 'DELETE' : 'PUT',
        headers: { 
          ...this.headers, 
          'Content-Type': 'application/json'
        },
      })
      .then(res => this._handleResponseData(res))
  }
}


const api = new Api({
  baseUrl: `https://mesto.nomoreparties.co/v1/${requestInfo.cohortId}`,
  headers: {
    //authorization: requestInfo.token,
    //'Content-Type': 'application/json'
    credentials: true,
  }
});

export default api;