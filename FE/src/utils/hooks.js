import { useState } from 'react';


// 장바구니 스테이트와 동일시 되게
export const useCart = (initCart, localStorage = null) => {
  const [cart, setStateCart] = useState(initCart);

  const setAllCart = (newCart) => {
    setStateCart(newCart);
    // 여기에 로컬 스토리지 업데이트
    localStorage && localStorage.setValue(newCart);
  };

  return { cart, setAllCart };
};

export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return { storedValue, setValue };
};
