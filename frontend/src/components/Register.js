import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    props.onRegister(password, email);
  }

  function handleInputChange(e) {
    e.target.name === 'email' ? setEmail(e.target.value) : setPassword((e.target.value));
  }

  return (
    <div className='auth-form-container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1 className='form__title form__title_type_auth'>Регистрация</h1>
        <input 
          name='email' 
          value={email} 
          onChange={handleInputChange} 
          className='form__input form__input_type_auth' 
          type='email' 
          placeholder='Email' 
        />
        <input 
          name='password' 
          value={password} 
          onChange={handleInputChange} 
          className='form__input form__input_type_auth' 
          type='password' 
          placeholder='Пароль' 
        />
        <button className='form__submit form__submit_type_auth' type='submit'>Зарегистрироваться</button>
        <span className='form__hint'>Уже зарегистрированы? <Link className='form__link' to='/sign-in'>Войти</Link></span>
      </form>
    </div>
  )
}

export default Register