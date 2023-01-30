import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');  

  function handleSubmit(e) {
    e.preventDefault();
    props.onLogin(password, email);
  }

  function handleInputChange(e) {
    e.target.name === 'email' ? setEmail(e.target.value) : setPassword(e.target.value);
  }

  return (
    <div className='auth-form-container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1 className='form__title form__title_type_auth'>Вход</h1>
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
        <button className='form__submit form__submit_type_auth' type='submit'>Войти</button>
        {/* Аналогично со страницей регистраций, будет удобно добавить эту опцию в том же виде под кнопкой*/}
        <span className='form__hint'>Еще нет аккаунта? <Link className='form__link' to='/sign-up'>Зарегистрироваться</Link></span>
      </form>
    </div>
  )
}

export default Login