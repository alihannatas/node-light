import nodemailler from "nodemailer";

const getIndexPage = (req, res) => {
  res.render("index", {
    link: "index",
  });
};

const getAboutPage = (req, res) => {
  res.render("about", {
    link: "about",
  });
};

const getRegisterPage = (req, res) => {
  res.render("register", {
    link: "register",
  });
};

const getLoginPage = (req, res) => {
  res.render("login", {
    link: "login",
  });
};

const getLogout = (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.redirect("/");
};

const getContact = (req, res) => {
  res.render("contact", {
    link: "contact",
  });
};

const sendMail = async (req, res) => {
  try {
    let transporter = nodemailler.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.SEND_MAIL,
        pass: process.env.SEND_MAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      to: 'alihan2644@gmail.com', // list of receivers
      subject: `LensLight Contact`, // Subject line
      html: `
         <div style>   From:  ${req.body.email} </div>  
         <div>Subject:  ${req.body.name} </div>
         <div>   text:  ${req.body.message} </div>
       `, // html body
    });

    res.status(200).json({ succeded: true });
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error,
    });
  }
};

export {
  getAboutPage,
  getIndexPage,
  getRegisterPage,
  getLoginPage,
  getLogout,
  getContact,
  sendMail,
};
