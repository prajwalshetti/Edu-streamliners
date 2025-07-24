import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

const sendSMSToParent = async (req, res) => {
    console.log("Came to sendSMSToParent");

    try {
        let { phoneNumber, studentName, attendanceStatus } = req.body;
        console.log("Received Data:", req.body);

        if (!phoneNumber || !studentName || attendanceStatus === undefined) {
            return res.status(400).json({
                success: false,
                message: "Phone number, student name, and attendance status are required"
            });
        }

        phoneNumber = `+91${phoneNumber}`;

        const message = await client.messages.create({
            body: `Hello, this is a message from the school. Your child ${studentName} was ${
                attendanceStatus ? "Present" : "Absent"
            } today.`,
            from: twilioPhoneNumber,
            to: phoneNumber
        });

        res.status(200).json({
            success: true,
            message: "SMS sent successfully",
            messageId: message.sid
        });

    } catch (error) {
        console.error("SMS Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send SMS",
            error: error.message
        });
    }
};

export { sendSMSToParent };
