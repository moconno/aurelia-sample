import environment from './environment';
import {HttpClient, json} from 'aurelia-fetch-client';

export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');

  let container = aurelia.container

  let http = new HttpClient();
  http.configure(config => {
    config
    .useStandardConfiguration()
    .withBaseUrl('https://qa-luigi.expapp.com/')
    .withDefaults({
      //credentials: 'same-origin',
      headers: {
        'X-EXP-API-KEY': 'TEG3VtfVnfLX6CmoRpox'
        //'Content-type' : 'application/json'
      }
    })
    .withInterceptor({
      request(request) {
        console.log(`Requesting ${request.method} ${request.url}`);
        return request;
      },
      response(response) {
        console.log(`Received ${response.status} ${response.url} ${response.data}`);
        return response;
      }
    });
  });

  container.registerInstance(HttpClient, http);

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
