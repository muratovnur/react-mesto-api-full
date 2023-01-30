import React from 'react'
import PopupWithForm from './PopupWithForm'

const AddPlacePopup = (props) => {
  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen])
  
  function handleSubmit(e) {
    e.preventDefault();

    props.onAddPlace({
      name,
      link
    });
  }

  function handleName(e) {
    setName(e.target.value);
  }

  function handleLink(e) {
    setLink(e.target.value);
  }

  return (
    <PopupWithForm 
      isOpen={props.isOpen} 
      onClose={props.onClose}
      name="add-card"
      title="Новое место"
      onSubmit={handleSubmit}
      submitText={`${props.isLoading ? 'Создание...' : 'Создать'}`}
      isLoading={props.isLoading}
    >
      <label className="form__field">
        <input
          value={name}
          onChange={handleName}
          id="card-name-input"
          type="text"
          name="input-card-name"
          className="form__input form__input_field_card-name"
          placeholder="Название"
          minLength={2}
          maxLength={30}
          required={true}
          autoFocus={true}
        />
        <span className="card-name-input-error form__input-error" />
      </label>
      <label className="form__field">
        <input
          value={link}
          onChange={handleLink}
          id="card-image-link-input"
          type="url"
          name="input-card-link"
          className="form__input form__input_field_card-link"
          placeholder="Ссылка на картинку"
          required={true}
        />
        <span className="card-image-link-input-error form__input-error" />
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup;