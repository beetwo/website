


let email 	= require("./path/to/emailjs/email"),
    server 	= email.server.connect({
                user:    "stephan",
                password:"stephanTwoBe.",
                host:    "mail.beetwo.at",
                ssl:     true })

// send the message and get a callback with an error or details of the message that was sent
server.send({
  text:    "i hope this works",
  from:    "you <stephan@beetwo.at>",
  to:      "me <info@lowi.org>",
  // cc:      "else <else@your-email.com>",
  subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });
