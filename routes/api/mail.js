var nodemailer = require('nodemailer');

function sendMail(emailid){

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
  }
});

var mailOptions = {
  from: 'learner.learn.official@gmail.com',
  to: emailid,
  subject: 'Nodemailer Verify',
  html: '<h1>< Welcome to webelight solutions... ></h1>'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports=sendMail