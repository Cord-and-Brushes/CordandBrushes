// SMS Utility functions
// This file can be integrated with actual SMS services like Twilio, AWS SNS, etc.

const sendSMS = async (phoneNumber, message) => {
  try {
    // TODO: Integrate with actual SMS service
    // Example integrations:

    // For Twilio:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // });

    // For AWS SNS:
    // const AWS = require('aws-sdk');
    // const sns = new AWS.SNS();
    // await sns.publish({
    //   Message: message,
    //   PhoneNumber: phoneNumber
    // }).promise();

    // For now, just log the message (for development)
    console.log(`SMS to ${phoneNumber}: ${message}`);

    return { success: true, messageId: Date.now().toString() };
  } catch (error) {
    console.error("SMS sending failed:", error);
    throw new Error("Failed to send SMS");
  }
};

const sendOTP = async (phoneNumber, otp) => {
  const message = `Your Cord & Brushes verification code is: ${otp}. Valid for 5 minutes.`;
  return await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendOTP,
};
