module.exports = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock indicator - OTP</title>
    <style>
        body {
            font-family: 'Roboto', Arial, sans-serif;
            background-color: #f4f9fd;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background: linear-gradient(145deg, #ffffff, #f0f8ff);
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e1e1e1;
        }
        .header {
            background: linear-gradient(90deg, #007bff, #00d4ff);
            padding: 25px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: bold;
        }
        .header p {
            margin: 5px 0 0;
            font-size: 16px;
            font-style: italic;
        }
        .body {
            padding: 25px;
            background-color: #ffffff;
        }
        .body p {
            font-size: 16px;
            margin-bottom: 20px;
            line-height: 1.8;
            color: #555;
        }
        .otp {
            display: inline-block;
            background: linear-gradient(90deg, #ff7e5f, #feb47b);
            padding: 12px 25px;
            border-radius: 8px;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;
            color: #ffffff;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background: linear-gradient(90deg, #00d4ff, #007bff);
            font-size: 14px;
            color: #ffffff;
        }
        .footer a {
            color: #ffeb3b;
            text-decoration: none;
            font-weight: bold;
        }
        .footer a:hover {
            text-decoration: underline;
        }
        @media (max-width: 600px) {
            .header h1 {
                font-size: 22px;
            }
            .body p {
                font-size: 14px;
            }
            .otp {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Welcome to Stock indicator!</h1>
        </div>
        <div class="body">
            <p>Hi there,</p>
            <p>Your One-Time Password (OTP) for login is:</p>
            <p class="otp">${data.otp}</p>
            <p>Please keep it confidential and do not share it with anyone.</p>
            <p>Thank you for choosing <strong>Stock indicator</strong>. If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Stock indicator. All rights reserved.</p>
            <p>Need help? <a href="mailto:support@test.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
`