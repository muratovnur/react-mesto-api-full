import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddCardPopup";
import ConfirmPopup from "./ConfirmPopup"
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { validationConfig } from '../utils/utils';
import api from "../utils/api";
import FormValidator from "../utils/FormValidator";
import * as auth from '../utils/auth.js';
import InfoTooltip from "./InfoTooltip";


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = React.useState(false);
  
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState({about: '', avatar: '', name: '', _id: ''});
  const [cards, setCards] = React.useState([]);
  const [requestInProgress, setRequestInProgress] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [submitSuccessful, setSubmitSuccessful] = React.useState(false);

  const history = useHistory();
  
  //Рефы для валидаций форм
  const formUpdateUserValidator = React.useRef(null);
  const formAddPlaceValidator = React.useRef(null);
  const formUpdateAvatarValidator= React.useRef(null);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardDeleteClick(card) {
    setIsConfirmPopupOpen(true);
    setSelectedCard(card);
  }

  function handleCardClick (card) {
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard(null);
    setRequestInProgress(false);
  }

  /*Для сброса валидаций были использованы хуки, потому что после успешного запроса, 
  при следующем открытий той же формы, кнопка сабмита всегда была активной.*/
  React.useEffect(() => {
    if (isEditAvatarPopupOpen) {
      formUpdateAvatarValidator.current.resetFormValidation();  
    }
  }, [isEditAvatarPopupOpen])

  React.useEffect(() => {
    if (isEditProfilePopupOpen) {
      formUpdateUserValidator.current.resetFormValidation();
    }
  }, [isEditProfilePopupOpen])

  React.useEffect(() => {
    if (isAddPlacePopupOpen) {
      formAddPlaceValidator.current.resetFormValidation();
    }
  }, [isAddPlacePopupOpen])

  React.useEffect(() => {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
    .then(([userData, cardsData]) => {
      setCurrentUser(userData);
      setCards(cardsData);
    })
    .catch((err) => {
      console.log(err);
    })
    initializeFormValidation();
  }, [])

  React.useEffect(() => {
    const token = localStorage.getItem('jwt')

    if (token) {
      auth.validateToken(token)
        .then(res => {
          setLoggedIn(true);
          setEmail(res.data.email);
          history.push('/');
        })
        .catch(err => {
          console.log(err);
        })
    }
  }, [history]) //По подсказке eslint

  //Инициализация валидаций форм
  function initializeFormValidation() {
    formUpdateUserValidator.current = new FormValidator(validationConfig, document.querySelector('.form_type_edit-profile'))
    formAddPlaceValidator.current = new FormValidator(validationConfig, document.querySelector('.form_type_add-card'));
    formUpdateAvatarValidator.current = new FormValidator(validationConfig, document.querySelector('.form_type_update-avatar'));
    formUpdateUserValidator.current.enableValidation();
    formAddPlaceValidator.current.enableValidation();
    formUpdateAvatarValidator.current.enableValidation();
  }

  
  function handleUpdateUser(inputData) {
    setRequestInProgress(true);
    api.updateUserInfo(inputData.name, inputData.about)
    .then((updatedUserInfo) => {
      setCurrentUser((currentUser) => ({...currentUser, name: updatedUserInfo.name, about: updatedUserInfo.about}))
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
      setRequestInProgress(false);
    })
  }

  function handleUpdateAvatar({ avatar }) {
    setRequestInProgress(true);
    api.updateUserAvatar(avatar)
    .then((updatedUserAvatar) => {
      setCurrentUser((currentUser) => ({...currentUser, avatar: updatedUserAvatar.avatar}))
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
      setRequestInProgress(false);
    })
  }

  function handleAddPlace({ name, link }) {
    setRequestInProgress(true);
    api.addCard(name, link)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
      setRequestInProgress(false);
    })
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.updateCardLike(card._id, isLiked)
    .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((err) => {
      console.log(err);
    })
  }

  function handleCardDelete() {
    setRequestInProgress(true);
    api.deleteCard(selectedCard._id)
    .then(() => {
      setCards((state) => state.filter((c) => c._id !== selectedCard._id));
      closeAllPopups();
    })
    .catch((err) => {
      console.log(err);
      setRequestInProgress(false);
    })
  }


  function onLogin(password, email) {
    auth.login(password, email)
    .then(res => {
      localStorage.setItem('jwt', res.token);
      setLoggedIn(true);
      setEmail(email);
      history.push('/');
    })
    .catch(err => {
      console.log("On login error is: ", err);
      setIsInfoTooltipPopupOpen(true);
    }) 
  }

  function onRegister(password, email) {
    auth.register(password, email)
    .then(res => {
      setSubmitSuccessful(true);
      setIsInfoTooltipPopupOpen(true);
      history.push('/sign-in');
    })
    .catch(err => {
      console.log("On register error is: ", err);
      setIsInfoTooltipPopupOpen(true);
    }) 
  }

  function onSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    
  }

  function onInfoTooltipClose() {
    setIsInfoTooltipPopupOpen(false);
    setSubmitSuccessful(false);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} email={email} onSignOut={onSignOut}/>
      <Switch>
        <Route path='/sign-in'>
          <Login onLogin={onLogin} />
        </Route>
        <Route path='/sign-up'>
          <Register onRegister={onRegister}/>
        </Route>
        <ProtectedRoute 
          component={Main}
          exact
          path='/'
          loggedIn={loggedIn}
          cards={cards}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDeleteClick}
          onEditProfile={handleEditProfileClick} 
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
        />
        <Route path='*'>
          <Redirect to={'/sign-in'} />
        </Route>
      </Switch>
      <Footer />
      <EditProfilePopup 
        isOpen={isEditProfilePopupOpen} 
        onClose={closeAllPopups} 
        onUpdateUser={handleUpdateUser} 
        isLoading={requestInProgress}/>
      <EditAvatarPopup 
        isOpen={isEditAvatarPopupOpen} 
        onClose={closeAllPopups} 
        onUpdateAvatar={handleUpdateAvatar} 
        isLoading={requestInProgress}/>
      <AddPlacePopup 
        isOpen={isAddPlacePopupOpen} 
        onClose={closeAllPopups} 
        onAddPlace={handleAddPlace} 
        isLoading={requestInProgress}/>
      <ImagePopup 
        isOpen={isImagePopupOpen} 
        onClose={closeAllPopups} 
        card={selectedCard} />
      <ConfirmPopup 
        isOpen={isConfirmPopupOpen} 
        onClose={closeAllPopups} 
        onCardDeleteConfirm={handleCardDelete} 
        isLoading={requestInProgress}/>
      <InfoTooltip isOpen={isInfoTooltipPopupOpen} submitSuccessful={submitSuccessful} onClose={onInfoTooltipClose}/>
    </CurrentUserContext.Provider>
  );
}

export default App;