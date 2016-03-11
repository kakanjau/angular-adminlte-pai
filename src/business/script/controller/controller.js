import ConsoleCtrl from './consoleCtrl';
import RootCtrl from './rootCtrl';
import SearchCtrl from './searchCtrl';
import PaiWorkSpaceCtrl from './paiWorkSpaceCtrl';

export default app => {
  INCLUDE_ALL_MODULES([ConsoleCtrl, RootCtrl, SearchCtrl, PaiWorkSpaceCtrl], app);
}