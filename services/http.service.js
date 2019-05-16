//import liraries
import axios from 'axios';

// create a class
class HttpService {

  _get(endpoint) {
    return new Promise((resolve, reject) => {
      axios.get(endpoint, {})
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(this.handleError(error));
        });
    });
  }

  extractData(res) {
    // let body = res.json() ? res.json() : {};
    try {
      return res.json() || {};
    } catch (e) {
      return false;
    }
  }

  handleError(error) {
    // if (error && error.status === 401) {
    //   //todo
    // }
    if (error.response)
      return error.response.data;
    else if(error.message)
      return error;
    else
      return 'Server Internal Error!';
  }

}

//make this available to the app
export const httpService = new HttpService();
