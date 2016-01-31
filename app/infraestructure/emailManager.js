import when from 'when';
import mandrill from '../config/mandrill';

export default {
  sendConfirmationEmail (email, packageInformation) {
    return when.promise((resolve, reject) => {
      let template_name = 'confirm-subscription';
      let message = {
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
            'content': packageInformation.toString()
          },
          {
            'name': 'confirm_action_url',
            'content': 'http://localhost:3000/confirm-subscription'
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
