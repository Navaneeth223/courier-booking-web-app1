const twilio = require('twilio');

const sendSMS = async (options) => {
  try {
    const client = twilio(process.env.SMS_ACCOUNT_SID, process.env.SMS_AUTH_TOKEN);

    const message = await client.messages.create({
      body: options.message,
      from: process.env.SMS_PHONE_NUMBER,
      to: options.phone
    });

    console.log('SMS sent: %s', message.sid);
    return message;
  } catch (err) {
    console.error('SMS Error:', err.message);
    // throw new Error('Failed to send SMS');
    // Silently log for now if config is missing
  }
};

module.exports = sendSMS;
