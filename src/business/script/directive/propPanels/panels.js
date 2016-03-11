import absPanel from './absPanel';
import experimentPanel from './experiment/experiment';

export default app => {
  INCLUDE_ALL_MODULES([absPanel, experimentPanel], app);
};