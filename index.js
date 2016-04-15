var mandrill = require('mandrill-api/mandrill');

var MandrillAdapter = mandrillOptions => {
  if (!mandrillOptions || !mandrillOptions.apiKey || !mandrillOptions.replyTo) {
    throw 'MandrillAdapter requires an API Key and a Reply-to Address.';
  }

  mandrillOptions.displayName =
      mandrillOptions.displayName ||
      mandrillOptions.replyTo;
  mandrillOptions.verificationSubject =
      mandrillOptions.verificationSubject ||
      'Please verify your e-mail for *|appname|*';
  mandrillOptions.verificationBody =
      mandrillOptions.verificationBody ||
      'Hi,\n\nYou are being asked to confirm the e-mail address *|email|* ' +
      'with *|appname|*\n\nClick here to confirm it:\n*|link|*';
  mandrillOptions.passwordResetSubject =
      mandrillOptions.passwordResetSubject ||
      'Password Reset Request for *|appname|*';
  mandrillOptions.passwordResetBody =
      mandrillOptions.passwordResetBody ||
      'Hi,\n\nYou requested a password reset for *|appname|*.\n\nClick here ' +
      'to reset it:\n*|link|*';

  var mandrill_client = new mandrill.Mandrill(mandrillOptions.apiKey);

  var sendVerificationEmail = options => {
    var message = {
      from_email: mandrillOptions.replyTo,
      from_name: mandrillOptions.displayName,
      to: [{
        email: options.user.get("email")
      }],
      subject: mandrillOptions.verificationSubject,
      text: mandrillOptions.verificationBody,
      global_merge_vars: [
        { name: 'appname', content: options.appName},
        { name: 'email', content: options.user.get("email")},
        { name: 'link', content: options.link}
      ]
    }

    return new Promise((resolve, reject) => {
        mandrill_client.messages.send(
          {
            message: message,
            async: true
          },
          resolve,
          reject
        )
    });
  }

  var sendPasswordResetEmail = options => {
    var message = {
      from_email: mandrillOptions.replyTo,
      from_name: mandrillOptions.displayName,
      to: [{
        email: options.user.get("email")
      }],
      subject: mandrillOptions.passwordResetSubject,
      text: mandrillOptions.passwordResetBody,
      global_merge_vars: [
        { name: 'appname', content: options.appName},
        { name: 'email', content: options.user.get("email")},
        { name: 'link', content: options.link}
      ]
    }

    return new Promise((resolve, reject) => {
        mandrill_client.messages.send(
        {
          message: message,
          async: true
        },
        resolve,
        reject
      )
    });
  }

  return Object.freeze({
    sendVerificationEmail: sendVerificationEmail,
    sendPasswordResetEmail: sendPasswordResetEmail
  });
}

module.exports = MandrillAdapter;