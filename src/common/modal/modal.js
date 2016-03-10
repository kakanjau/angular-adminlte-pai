import alertService from './alertService';
import dialogService from './dialogService';

export default app => {
  alertService(app);
  dialogService(app);
}