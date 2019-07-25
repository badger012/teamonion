import React, {
  useState, useCallback,
} from 'react';
import '../styles/SignInPopup.scss';
import propTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import tmonglogo from '../image/tmonglogo.png';
import { signInRequestAction, signInPopupChangeAction } from '../redux/actions/userAction';
import Loading from './Loading';

const SignInPopup = ({ setIsLoginPopup, isSigningIn }) => {
  const [inputId, setInputID] = useState('');
  const [inputPw, setInputPw] = useState('');
  const [resultId] = useState('');
  const dispatch = useDispatch();

  const submitCallback = useCallback(
    (e) => {
      e.preventDefault();
      if (inputId !== '' && inputPw !== '') {
        dispatch(signInRequestAction({ memberId: inputId, password: inputPw }));
        setIsLoginPopup('false');
      } else {
        alert('정보입력이 필요합니다');
      }
    },
    [inputId, inputPw, dispatch, setIsLoginPopup],
  );

  const popupControl = useCallback(
    () => {
      dispatch(signInPopupChangeAction());
    }, [dispatch],
  );

  return (
    <div className="loginPopup">
      {isSigningIn && <Loading />}
      <input
        className="closeBtn"
        type="button"
        value="X"
        onClick={() => {
          setInputID('');
          setInputPw('');
          popupControl();
        }}
      />
      <img className="login-logo" src={tmonglogo} alt="logo" />
      <form
        onSubmit={(e) => {
          submitCallback(e);
          setInputID('');
          setInputPw('');
        }}
      >
        <div className="id-area">
          <h3>ID</h3>
          <input
            className="idInput"
            type="text"
            onChange={e => setInputID(e.target.value)}
            value={inputId}
          />
        </div>
        <div className="pw-area">
          <h3>PW</h3>
          <input
            className="pwInput"
            type="password"
            onChange={e => setInputPw(e.target.value)}
            value={inputPw}
          />
        </div>
        <div className="signUp" onClick={() => popupControl()}>
          <Link to="/signup">회원가입</Link>
        </div>
        <input className="submitBtn" type="submit" value="로그인" />
      </form>
      <div>{resultId}</div>
    </div>
  );
};

SignInPopup.defaultProps = {
  setIsLoginPopup: () => {},
};

SignInPopup.propTypes = {
  setIsLoginPopup: propTypes.func,
  isSigningIn: propTypes.bool.isRequired,
};

export default SignInPopup;
