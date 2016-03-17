import ConsoleCtrl from './consoleCtrl';
import RootCtrl from './rootCtrl';
import SearchCtrl from './searchCtrl';
import PaiWorkSpaceCtrl from './paiWorkSpaceCtrl';
import ToolBoxCtrl from './toolBox/ToolBoxCtrl';
import ExperimentCtrl from './toolBox/experimentCtrl';
import ExperimentFileMenuCtrl from './toolBox/experimentFileMenuCtrl';
import ExperimentFolderMenuCtrl from './toolBox/experimentFolderMenuCtrl';
import DatasourceCtrl from './toolBox/datasourceCtrl';
import ComponentCtrl from './toolBox/componentCtrl';

export default app => {
  INCLUDE_ALL_MODULES(
    [ConsoleCtrl, RootCtrl, SearchCtrl, PaiWorkSpaceCtrl, ToolBoxCtrl, 
      ExperimentCtrl, ExperimentFileMenuCtrl, ExperimentFolderMenuCtrl, 
      DatasourceCtrl, ComponentCtrl]
    , app);
}