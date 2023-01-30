import { Link, useLocation } from "react-router-dom";

function Header(props) {
  const location = useLocation();

  return (
    <header className="header">
        <div className="header__logo" />
        <div className="header__menu">
          {props.loggedIn ? 
            <>
              <p className="header__email">{props.email}</p>
              <Link className="header__auth-link header__auth-link_type_grey" to={'/sign-in'} onClick={props.onSignOut}>Выйти</Link>
            </> :
            location.pathname === '/sign-in' ? 
            <Link className="header__auth-link" to={'/sign-up'}>Регистрация</Link> :
            <Link className="header__auth-link" to={'/sign-in'}>Войти</Link>
          }
        </div>
    </header>
  );
}

export default Header;