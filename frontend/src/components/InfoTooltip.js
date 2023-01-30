import React from 'react'

const InfoTooltip = (props) => {
  return (
    <div className={`${props.isOpen && 'popup_opened'} popup`}>
      <div className='popup__container'>
        {props.submitSuccessful ? (
          <>
            <div className='popup__auth-svg popup__auth-svg_type_success'></div>
            <p className='popup__auth-text'>Вы успешно зарегистрировались!</p>
          </>) : (
          <>
            <div className='popup__auth-svg popup__auth-svg_type_fail'></div>
            <p className='popup__auth-text'>Что-то пошло не так! Попробуйте ещё раз.</p>
          </>)}
        <button type="button" className="popup__close-btn" onClick={props.onClose}/>
      </div>
    </div>
  )
}

export default InfoTooltip