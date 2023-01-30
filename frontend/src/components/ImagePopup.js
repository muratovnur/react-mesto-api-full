function ImagePopup(props) {
  return (
    <div className={`${props.isOpen && "popup_opened"} popup popup_type_inspect-image`}>
        <div className="popup__image-container">
          <img className="popup__image" src={`${props.card && props.card.link}`} alt={`Изображение ${props.card && props.card.name}`}/>
          <h2 className="popup__subtitle">{props.card && props.card.name}</h2>
          <button type="button" className="popup__close-btn popup__close-btn_inspect-image" onClick={props.onClose}/>
        </div>
    </div>
  )
}

export default ImagePopup;