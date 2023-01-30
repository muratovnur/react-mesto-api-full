import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <main className="content">
        <section className="profile">
          <button type="button" className="profile__update-avatar" onClick={props.onEditAvatar}>
            <img alt="Аватар профиля" className="profile__avatar" src={currentUser && currentUser.avatar} />
          </button>
          <div className="profile__info">
            <div className="profile__name-wrapper">
              <h1 className="profile__name">{currentUser && currentUser.name}</h1>
              <button type="button" className="profile__button profile__edit-btn" onClick={props.onEditProfile}/>
            </div>
            <p className="profile__about-self">{currentUser && currentUser.about}</p>
          </div>
          <button type="button" className="profile__button profile__add-btn" onClick={props.onAddPlace}/>
        </section>
        <section className="elements">
          {props.cards.map(card => {
              return (
                <Card card={card} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete} key={card._id} />
              )
            })}
        </section>
      </main>
  );
}

export default Main;