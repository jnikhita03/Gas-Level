const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { getDatabase, ref, get, set } = require('firebase/database');
const { initializeApp } = require('firebase/app');
require('dotenv').config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBq9ePD0q78ow8pMmgZ-MupsIN3gltDPRg",
  authDomain: "lpg-gas-level-detection.firebaseapp.com",
  databaseURL: "https://lpg-gas-level-detection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lpg-gas-level-detection",
  storageBucket: "lpg-gas-level-detection.appspot.com",
  messagingSenderId: "561346610904",
  appId: "1:561346610904:web:b9b803b4a8125b861779ad"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Email transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '125158075@sastra.ac.in', // Email and password should be stored in environment variables
    pass: 'tgak qjfy oejz riil'
}});

// Function to send alert email for low gas levels
const sendAlertEmail = async (email, message) => {
  const mailOptions = {
    from: '125158075@sastra.ac.in',
    to: email,
    subject: 'LPG Gas Level Alert Notification!',
    html: `<p><strong>LPG Gas Level Alert!</strong></p><p>${message}</p>`
  };

  try {
    console.log(`Sending alert email to: ${email}`);
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent to ${email}`);
  } catch (error) {
    console.error('Error sending alert email:', error);
  }
};

// Function to check gas levels and send alerts if below threshold
const checkGasLevelAlerts = async () => {
  try {
    const lpgLevelRef = ref(db, 'LPG_Level');
    const snapshot = await get(lpgLevelRef);

    if (snapshot.exists()) {
      const lpgLevelData = snapshot.val();
      const gasLevel = parseFloat(lpgLevelData.gaslevel);

      if (gasLevel < 15) { // 40% threshold
        console.log(`Low gas level detected: ${gasLevel}kg`);
        const alertMessage = `
          Low gas level detected (Level: ${gasLevel}kg). 
          <br><br><strong>Safety Recommendations:</strong><br>
          1. Refill your gas cylinder as soon as possible.<br>
          2. Keep the area well ventilated to avoid gas accumulation.<br>
          3. Ensure your gas stove and other gas appliances are turned off when not in use.<br>
          <br><strong>Copyright © 2024 Monica Sri & Jaya Nikhita. All rights reserved.</strong>
        `;

        // Send email to registered user
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);

        if (usersSnapshot.exists()) {
          const users = usersSnapshot.val();

          for (const userId in users) {
            const user = users[userId];
            if (user.email) {
              await sendAlertEmail(user.email, alertMessage);
            }
          }
        } else {
          console.log('No users found.');
        }
      }
    } else {
      console.log('No LPG Level data found.');
    }
  } catch (error) {
    console.error('Error checking gas level alerts:', error);
  }
};

// Registration endpoint
app.post('/SignUp', async (req, res) => {
  const { email, phoneNumber, uid } = req.body;

  try {
    // Fetch current gas level
    const lpgLevelRef = ref(db, 'LPG_Level');
    const snapshot = await get(lpgLevelRef);

    let gasLevel = null;
    if (snapshot.exists()) {
      const lpgLevelData = snapshot.val();
      gasLevel = lpgLevelData.gaslevel;
    }

    // Store user information in Firebase
    await set(ref(db, `users/${uid}`), {
      email,
      phoneNumber,
      gaslevel: gasLevel
    });

    // Send thank-you email
    const mailOptions = {
      from:'125158075@sastra.ac.in',
      to: email,
      subject: 'Thank You for Registering!',
      html: `
        <p><strong>Thank You for Registering!</strong></p>
        <p>Dear ${email},</p>
        <p>Thank you for joining our LPG Gas Level Detection System. You will now receive timely alerts when your gas level is low, helping you to stay safe and well-prepared.</p>
        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        <p>Stay safe and informed!</p>
        <br><strong>Copyright © 2024 Monica Sri & Jaya Nikhita. All rights reserved.</strong>`
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send('Registration successful and thank-you email sent!');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Error during registration: ' + error.message);
  }
});

// Periodic gas level checks (every 60 seconds)
setInterval(checkGasLevelAlerts, 60000);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
