import { useMediaQuery } from 'react-responsive';
import { createContainer } from 'unstated-next';

function useMedia() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });
  return { isTabletOrMobile };
}

export default createContainer(useMedia);
