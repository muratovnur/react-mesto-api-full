import { baseUrl } from "./utils";

class Api {
  constructor({ baseUrl, options }) {
    this.baseUrl = baseUrl;
    this.options = options;
  }


  _handleResponseData(res) {
    if (res.ok) {
      return res.json();    
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }


  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me` , {
        ...this.options,
      })
      .then(res => this._handleResponseData(res))
  }


  getInitialCards() {
    return fetch(`${this.baseUrl}/cards` , {
        ...this.options,
      })
      .then(res => this._handleResponseData(res))
  }


  addCard(name, link) {
    return fetch(`${this.baseUrl}/cards` , {
        ...this.options,
        method: 'POST',
        body: JSON.stringify({
          name: name,
          link: link
        })
      })
      .then(res => this._handleResponseData(res))
  }


  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
        ...this.options,
        method: 'DELETE',
      })
      .then(res => this._handleResponseData(res))
  }

  
  updateUserInfo(name, about) {
    return fetch(`${this.baseUrl}/users/me` , {
        ...this.options,
        method: 'PATCH',
        body: JSON.stringify({
          name: name,
          about: about
        })
      })
      .then(res => this._handleResponseData(res))
  }


  updateUserAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar` , {
        ...this.options,
        method: 'PATCH',
        body: JSON.stringify({
          avatar: avatar
        })
      })
      .then(res => this._handleResponseData(res))
  }
  

  updateCardLike(cardId, isLiked) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
        ...this.options,
        method: isLiked ? 'DELETE' : 'PUT',
      })
      .then(res => this._handleResponseData(res))
  }
}


const api = new Api({
  baseUrl: baseUrl,
  options: {
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
  }
});

export default api;