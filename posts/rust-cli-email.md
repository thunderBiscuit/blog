---
title: "Tiny Rust-CLI 1: Sending Emails From Your Command Line"
date: "2019-09-17"
year: "2019"
tags: ["rust", "cli-apps"]
---

> The Tiny Rust-CLI series is a series of blog posts about small cool command line interface apps I build just for the fun of Rust and discovering crates. Check out the one that returns the current price of bitcoin [here]().

## What we'll need

This CLI app is built using three code snippets and mixing + modifying them. It also relies on two main crates, `lettre` for handling email, and `clap` for parsing command line arguments.

Our dependencies will be:

```toml
[dependencies]
lettre = "0.9"
lettre_email = "0.9"
clap = "2.33"
```

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
use std::env;

// --snip--

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

# Notes

Why do we use unwrap() on the environment variables?
What is the is_err() method doing on them?

```

```
