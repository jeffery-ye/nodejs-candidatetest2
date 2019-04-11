var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 's.jeffery.ye@gmail.com',
    pass: 'Siyuan05'
  }
});

var mailOptions = {
  from: 's.jeffery.ye@gmail.com',
  to: 's.jeffery.ye@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});