function StorageFactory() {
  const store = window.localStorage;

  return {
    setToken: (token) => store.setItem('uDomoToken', token.toString()),
    getToken: () => store.getItem('uDomoToken'),
    deleteToken: () => store.removeItem('uDomoToken'),
  };
}

export default angular.module('uDomo.Common').factory('StorageFactory', StorageFactory);
