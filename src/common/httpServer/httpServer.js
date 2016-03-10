import errorHandle from './errorHandle';
import loginService from './loginService';
import httpService from './httpService';

export default app => {
  errorHandle(app);
  loginService(app);
  httpService(app);
}