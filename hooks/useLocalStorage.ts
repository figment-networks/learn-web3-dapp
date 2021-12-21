import {useState} from 'react';

const useLocalStorage = <StateT>(key: string, initialValue?: StateT) => {
  const [storedValue, setStoredValue] = useState<StateT>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return {};
    }
  });

  const setValue = (value: StateT | ((val: StateT) => StateT)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
