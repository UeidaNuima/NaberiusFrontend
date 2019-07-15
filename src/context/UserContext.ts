import { useState } from 'react';
import { createContainer } from 'unstated-next';

function useUser() {
  const [state, setState] = useState(localStorage.getItem('fuck') || '');
  return {
    get isLoggedIn() {
      return (
        state === 'fuckpulu' ||
        state === 'fuckbaozitou' ||
        state === 'fuckmaoxiong' ||
        state === 'fucktuo'
      );
    },
    login(token: string) {
      console.log(token);
      setState(token);
      localStorage.setItem('fuck', token);
    },
  };
}

export default createContainer(useUser);
