import ConsoleCtrl from './consoleCtrl';
import RootCtrl from './rootCtrl';
import SearchCtrl from './searchCtrl';

export default app => {
  INCLUDE_ALL_MODULES([ConsoleCtrl, RootCtrl, SearchCtrl], app);
}