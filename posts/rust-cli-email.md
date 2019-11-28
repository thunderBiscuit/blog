---
title: "Tiny Rust-CLI 1: Sending Emails From Your Command Line"
date: "2019-10-31"
year: "2019"
tags: ["rust", "cli-apps"]
---

> The Tiny Rust-CLI series is a series of blog posts about small cool command line interface apps I build just for the fun of Rust and discovering crates. Check out the one that returns the current price of bitcoin [here]().

## What we'll need

This CLI app is built using three code snippets and mixing + modifying them. It also relies on two main crates, `lettre` for handling email, and `clap` for parsing command line arguments.

Snippet #1 is for `clap` and comes from the [Rust Cookbook](https://rust-lang-nursery.github.io/rust-cookbook/cli/arguments.html):

```rust
// snippet 1: parsing command line arguments
extern crate clap;

use clap::{Arg, App};

fn main() {
    let matches = App::new("My Test Program")
        .version("0.1.0")
        .author("Hackerman Jones <hckrmnjones@hack.gov>")
        .about("Teaches argument parsing")
        .arg(Arg::with_name("file")
                 .short("f")
                 .long("file")
                 .takes_value(true)
                 .help("A cool file"))
        .arg(Arg::with_name("num")
                 .short("n")
                 .long("number")
                 .takes_value(true)
                 .help("Five less than your favorite number"))
        .get_matches();

    let myfile = matches.value_of("file").unwrap_or("input.txt");
    println!("The file passed is: {}", myfile);

    let num_str = matches.value_of("num");
    match num_str {
        None => println!("No idea what your favorite number is."),
        Some(s) => {
            match s.parse::<i32>() {
                Ok(n) => println!("Your favorite number must be {}.", n + 5),
                Err(_) => println!("That's not a number! {}", s),
            }
        }
    }
}
```

Snippet #2 comes from [lettre's README on GitHub]():

```rust
// snippet 2: you've got mail
extern crate lettre;
extern crate lettre_email;

use lettre::{SmtpClient, Transport};
use lettre_email::{Email, mime::TEXT_PLAIN};
use std::path::Path;

fn main() {
    let email = Email::builder()
        // Addresses can be specified by the tuple (email, alias)
        .to(("user@example.org", "Firstname Lastname"))
        // ... or by an address only
        .from("user@example.com")
        .subject("Hi, Hello world")
        .text("Hello world.")
        .attachment_from_file(Path::new("Cargo.toml"), None, &TEXT_PLAIN)
        .unwrap()
        .build()
        .unwrap();

    // Open a local connection on port 25
    let mut mailer = SmtpClient::new_unencrypted_localhost().unwrap().transport();
    // Send the email
    let result = mailer.send(email.into());

    if result.is_ok() {
        println!("Email sent");
    } else {
        println!("Could not send email: {:?}", result);
    }

    assert!(result.is_ok());
}
```

Snippet #3 is from [The Rust Programming Language Book](https://doc.rust-lang.org/book/ch12-05-working-with-environment-variables.html)'s section on working with environment variables:

```rust
// snippet 3: environment variables
use std::env;

impl Config {
pub fn new(args: &[String]) -> Result<Config, &'static str> {
if args.len() < 3 {
return Err("not enough arguments");
}

        let query = args[1].clone();
        let filename = args[2].clone();

        let case_sensitive = env::var("CASE_INSENSITIVE").is_err();

        Ok(Config { query, filename, case_sensitive })
    }

}

```

Each one of those snippets is self-sufficient; I invite you to test them on your own and play with them to get used to how they work.

## Our Tool

The next part of this article is really just about rewriting some of the above snippets to make them work together and send emails right from our command line. When it's all said and done, the final version of our cli tool is 70 lines of Rust code—I said _Tiny_ remember?

Our manifest file for the crate will be:

```toml
[package]
name = "rust-email"
version = "0.1.0"
edition = '2018'

[dependencies]
lettre = "0.9"
lettre_email = "0.9"
clap = "2.33"
```

And the whole `main.rs` file will then be

```rust
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
```

Notice that for the tool to work, we need to have defined two environment variables: `EMAIL_ADDRESS` and `EMAIL_PASS`. A quick and easy way to define those is to write them at the bottom of your `.bashrc` or `.bash_profile` file like so:

```shell
# environment variables
export EMAIL_ADDRESS="lukeskywalker@protonmail.com"
export EMAIL_PASS="I like lightsabers"
```

Make sure you don't use an important email for this because this little hack up there is clearly a security risk in that the password for the email you'll use is written in plain text in your bash config file. For now we just want our little cli to work, so we're using this simple trick.

## Sending our First Email

Now the last thing we need to do is compile our code and use the executable! `cargo build --release` will compile our tool and output it's executable in the `/target/release/` directory. You can run the binary directly from that folder, or move the compiled binary in your PATH—for MacOS and Linux, the default directory for those binaries would be `usr/local/bin`—in order to allow the tool to be called from anywhere.

Now let's fire it up!

```shell
$ rust-email -r "darth@deathstar.com" -s "Have you seen my hand?" -b "I've been looking for it everywhere"
Your email will be sent to darth@deathstar.com with subject "Have you seen my hand?".
Email sent
```
