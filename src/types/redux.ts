export interface IAction<T = any> {
  type: string;
  payload: T;
}
