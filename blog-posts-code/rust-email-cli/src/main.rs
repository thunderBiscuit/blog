use std::env;

use lettre::smtp::authentication::Credentials;
use lettre::{SmtpClient, Transport};
use lettre_email::Email;

use clap::{Arg, App};

fn main() {
    let matches = App::new("Rust CLI emailer")
        .version("0.1.1")
        .author("Luke Skywalker <skywalker@protonmail.com>")
        .about("Send emails from your command line")
        .arg(Arg::with_name("recipient")
                 .short("r")
                 .long("recipient")
                 .takes_value(true)
                 .help("The recipient of your email"))
        .arg(Arg::with_name("subject")
                 .short("s")
                 .long("subject")
                 .takes_value(true)
                 .help("The subject of your email"))
        .arg(Arg::with_name("body")
                 .short("b")
                 .long("body")
                 .takes_value(true)
                 .help("The body of your email"))
        .get_matches();

    let email_recipient = matches.value_of("recipient").unwrap();
    let email_subject = matches.value_of("subject").unwrap();
    let email_body = matches.value_of("body").unwrap();

    println!("Your email will be sent to {} with subject \"{}\".", email_recipient, email_subject);


    let mail_address = env::var("EMAIL_ADDRESS").unwrap();
    let mail_password = env::var("EMAIL_PASS").unwrap();

    let email = Email::builder()
        .to(email_recipient)
        .from(mail_address.clone())
        .subject(email_subject)
        .text(email_body)
        .build()
        .unwrap();

    let creds = Credentials::new(
        mail_address.to_string(),
        mail_password.to_string(),
    );

    // Open connection to gmail
    let mut mailer = SmtpClient::new_simple("smtp.gmail.com")
        .unwrap()
        .credentials(creds)
        .transport();

    // Send the email
    let result = mailer.send(email.into());

    if result.is_ok() {
        println!("Email sent");
    } else {
        println!("Could not send email: {:?}", result);
    }

    assert!(result.is_ok());
}
