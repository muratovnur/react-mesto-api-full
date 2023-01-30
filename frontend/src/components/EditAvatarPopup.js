import React from 'react'
import PopupWithForm from './PopupWithForm'

const EditAvatarPopup = (props) => {
  const inputRef = React.useRef('');

  function handleSubmit(e) {
    e.preventDefault()

    props.onUpdateAvatar({
      avatar: inputRef.current.value
    })
  }

  React.useEffect(() => {
    if(props.isOpen){
      inputRef.current.value = '';
    }
  }, [props.isOpen])

  return (
    <PopupWithForm 
      isOpen={props.isOpen} 
      onClose={props.onClose} 
      name="update-avatar"
      title="Обновить аватар"
      onSubmit={handleSubmit}
      submitText={`${props.isLoading ? 'Сохранение...' : 'Сохранить'}`}
      isLoading={props.isLoading}
    >
      <label className="form__field">
        <input
          id="avatar-link-input"
          type="url"
          name="input-avatar-link"
          className="form__input form__input_field_avatar-link"
          placeholder="Ссылка на изображение"
          required={true}
          autoFocus={true}
          ref={inputRef}
        />
        <span className="avatar-link-input-error form__input-error" />
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup