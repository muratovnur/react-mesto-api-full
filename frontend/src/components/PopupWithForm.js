function PopupWithForm(props) {
  return (
    <div className={`${props.isOpen && "popup_opened"} popup popup_type_${props.name}`}> 
      <div className="popup__container">
        <form name={`form-${props.name}`} className={`form form_type_${props.name}`} onSubmit={props.onSubmit} noValidate={true}>
          <h2 className="form__title">{props.title}</h2>
          {props.children}
          {/* {props.loading ? (<button type="submit" className="form__submit form__submit_inactive">Отправка...</button>) 
          : (<button type="submit" className="form__submit">{props.submitText}</button>)} */}
          <button type="submit" className={`form__submit ${props.isLoading && 'form__submit_inactive'}`} disabled={props.isLoading}>{props.submitText}</button>
        </form>
        <button type="button" className="popup__close-btn" onClick={props.onClose}/>
      </div>
    </div>
  );
}

export default PopupWithForm;