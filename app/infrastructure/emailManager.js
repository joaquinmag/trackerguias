import when from 'when';
import mandrill from '../config/mandrill';
import urlMap from '../controller/urlMappings';
import Courier from '../data/bookshelf/model/Courier';

export default class EmailManager {
  static initialize(hostname, port) {
    EmailManager.hostname = hostname;
    EmailManager.port = port;
  }

  sendNewDifferences(email, trackingData, differences) {
    return when.resolve();
  }

  sendConfirmationEmail(email, packageInformation, encryptedParameter) {
    return when.promise((resolve, reject) => {
      const hostname = EmailManager.hostname;
      const port = EmailManager.port;
      const printablePackageInfo = Courier.buildCourier(packageInformation.courier)
        .readableTrackingData(packageInformation.trackingData);
      const template_name = 'confirm-subscription';
      const message = {
        'to': [{
          'email': email,
          'type': 'to'
        }],
        'important': false,
        'track_opens': true,
        'track_clicks': true,
        'auto_text': true,
        'auto_html': false,
        'url_strip_qs': false,
        'preserve_recipients': false,
        'view_content_link': true,
        'merge': true,
        'merge_language': 'handlebars',
        'global_merge_vars': [
          {
            'name': 'encomienda',
            'content': printablePackageInfo
          },
          {
            'name': 'confirm_action_url',
            'content': `http://${hostname}:${port}${urlMap.confirmSubscription}/${encryptedParameter}`
          }
        ],
        'tags': [
          'confirm-subscription'
        ]
      };
      let async = false;
      let ip_pool = 'Main Pool';
      mandrill.messages.sendTemplate({
        'template_name': template_name,
        'template_content': [],
        'message': message,
        'async': async,
        'ip_pool': ip_pool
      }, resolve, reject);
    });
  }
}
