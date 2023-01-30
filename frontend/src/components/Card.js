import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {    
    props.onCardDelete(props.card);
  }

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = props.card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardRemoveButtonClassName = `element__remove ${isOwn && 'element__remove_active'}`;

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some(i => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like ${isLiked && 'element__like_active'}`;

  return (
    <div className="element">
      <img className="element__image" onClick={handleClick} src={props.card.link} alt={`Изображение ${props.card.name}`} />
      <button type="button" className={`${cardRemoveButtonClassName}`} onClick={handleDeleteClick} />
      <div className="element__title-wrapper">
        <h2 className="element__title">{props.card.name}</h2>
        <div className="element__like-wrapper">
          <button type="button" className={`${cardLikeButtonClassName}`} onClick={handleLikeClick} />
          <p className="element__like-number">{props.card.likes.length}</p>
        </div>
      </div>
    </div>
  )
}

export default Card;