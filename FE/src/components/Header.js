import React, {
  useEffect, useRef, useState, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MobileHeader from './MobileHeader';
import PcHeader from './PcHeader';
import SignInPopup from './SignInPopup';
import { logOutAction, signInRefRegisterAction, SIGNIN_SUCCESS } from '../redux/actions/userAction';

const Header = () => {
  const { isSignedIn, me } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const loginRef = useRef(null); // 애를 리덕스에 넣자
  const [isList, setIsList] = useState(false);
  const [isLoginPopup, setIsLoginPopup] = useState(false);
  const logOutDispatch = useCallback(
    () => {
      dispatch(logOutAction());
    },
    [dispatch],
  );
  useEffect(() => {
    dispatch(signInRefRegisterAction(loginRef));
  }, []);
  return (
    <>
      <MobileHeader
        logOutDispatch={logOutDispatch}
        isList={isList}
        setIsList={setIsList}
        isSignedIn={isSignedIn}
        user={me}
        setIsLoginPopup={setIsLoginPopup}
        dispatch={dispatch}
      />
      <PcHeader
        isSignedIn={isSignedIn}
        user={me}
        loginRef={loginRef}
        logOutDispatch={logOutDispatch}
        setIsLoginPopup={setIsLoginPopup}
      />
      {isLoginPopup
      && (
      <div className="signInContainer" ref={loginRef}>
        <SignInPopup setIsLoginPopup={setIsLoginPopup} />
      </div>
      )}
    </>
  );
};
export default Header;
