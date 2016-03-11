import resizeBar from './resizeBar';
import propPanels from './propPanels/panels';

export default app => {
  INCLUDE_ALL_MODULES([resizeBar, propPanels], app);
}