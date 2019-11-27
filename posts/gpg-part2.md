---
title: "GPG for the Working Man — Part 2 (encryption)"
date: "2019-09-12"
year: "2019"
tags: ["gpg"]
---

The goal of this post is to get you up to speed on two of the main uses of GPG: cryptographically encrypting and decrypting data.

> Note: this post is the second in a series aimed at developing a functional use of GPG for the day-to-day tasks of anyone who cares about software. Check out [part 1](/gpg-part1) to learn about signing and verifying signatures.

GPG stands for _GNU Privacy Guard_ and is a small open source piece of software that allows you to manage keys for cryptographic purposes. GPG implements the OpenPGP standard maintained by the Internet Engineering Task Force. In practice, the terms GPG, OpenPGP, and PGP are often used interchangably even though they probably shouldn't be. You can think of OpenPGP as email and GPG as one implementation of the email protocol (like Hotmail or Gmail).

One important aspect of cryptographic keys is that they are simply numbers. These are often really, really big numbers, but simple integers nonetheless. Another important aspect of cryptographic keys as used in GPG is that they come in pairs: a _public_ key and a _private_ key. Knowledge of these numbers (the keys) allows us to perform many tasks, two of which we'll tackle here:

1. Encrypt a message in a way that only a person with the knowledge of a specific key could decrypt.
2. Decrypt a message that was encrypted for a private key you own.

> There is much more to learn about privacy, encryption, and GPG than I cover in this series; for information on who invented this whole thing in the first place, check out [Phil Zimmermann's Wikipedia page](https://en.wikipedia.org/wiki/Phil_Zimmermann); for more on the difference between GPG and PGP, check out [this article](https://www.goanywhere.com/blog/2013/07/18/openpgp-pgp-gpg-difference); to dig deeper into the specifics of GPG, check out [their docs](https://gnupg.org/).

## Priors

<em>This section is the same as the Priors section from [Part 1](/gpg-part1). If you have already set up gpg, created a key, exported it, and imported other people's keys, you can safely move on to [Task 3]() on encrypting messages.</em>

#### Create Keys

The first thing that we want to do is create a key. I recommend creating an test key with a simple password to use for the rest of this tutorial, and deleting it afterwards:

```shell
$ gpg --full-generate-key  # generate a new key
```

The process of creating a new key requires that we answer some question about key type and size, as well as associate some information with the key. If you answer the few questions required to build a key, you should soon find that you now have a key available in your GPG keyring. To see what keys are available, enter:

```shell
$ gpg --list-keys
pub   rsa1024 2019-09-14 [SC]
      0E94A26389C61705D08560DFE8C2F3D9893479A7
uid           [ultimate] MrAnderson <MrAnderson@email.com>
sub   rsa1024 2019-09-14 [E]
```

We now have a key pair available to us for the tasks below. The `--list-key` command outputs some metadata (?) about the key, as well as a fingerprint—the `0E94A26389C61705D08560DFE8C2F3D9893479A7` part. The fingerprint is a hash of the public key, and can therefore be used for identification.

#### Exporting and Importing Keys

To verify the validity of your signature on data or encrypt messages destined for you, other users will need to have your public key information. We can export our public key to a file using the following command, and then simply share the file with anyone we wish:

```
gpg --export --armor MrAnderson > MrAndersonPubKey.asc
```

Once you have someone's public key file, you'll need to import it into your keyring before being able to use it:

```
gpg --import MorpheusPubKey.asc
```

#### ASCII-armor Format

You can share your keys in binary format, or, often more conveniently, in a text format called ASCII-armor. You can print your public key to the console using the name or the email associated with the key as the last argument as in `gpg --export --armor MrAnderson`, or generate a file with your key in it using the following commands:

```shell
# generate public key file in binary format
$ gpg --export MrAnderson > myBinaryPubKey.gpg

# generate public key file in ASCII-armor format
$ gpg --export --armor MrAnderson > MrAndersonPubKey.asc

# print content of key file in ASCII-armor format to console
$ cat MrAndersonPubKey.asc
-----BEGIN PGP PUBLIC KEY BLOCK-----

mI0EXX0oXQEEAK/NyXBQxd1s9s3SYSVXMXfW0a3XR6JGwzf3ocfCu8OP12hVMvfo
BQfdj2WllNsWWpzNRJdeK2QCtLudykPNKtY7BuAk5bIWbGuVsNkWU/UmJZqijE0Q
aA+g2K1DFST5h4N12vLyLnN0On7RaJsTizR083E2QATsU/3VjP3Y3LUnABEBAAG0
IU1yQW5kZXJzb24gPE1yQW5kZXJzb25AZW1haWwuY29tPojOBBMBCAA4FiEEDpSi
Y4nGYN/owvMXBdCF2Yk0eacFAl19KF0CGwMFCwkIBwIGFQoJCAsCBBYCAwECHgEC
F4AACgkQBdCF2Yk0eadEqgQAm/LeK4BK77OPhy2jiouhmyhM922sATp07uP0s+WY
lJZZOlLSELc7FMn+iSzgsoBic432UFZVfJ5FZukn9oSSrvJagw7nx4Y3rIyUNDc+
0Dcw2lKH8WDqXXoANgWSewPb6P+kBq+ihVanaWgsG9a1nvb4/BoubMMoccAj3EaH
0Yq4jQRdfShdAQQArXj8/Ch3y//xeSPDXXu/HlylYT56s9gTOs8PzW/yeR8XAzGG
+YThFvMsRdfr8VYwr8fsNT+fS12IadaiwOX6ejs63LnE9WnyfnYdVTQO5ZTh61eU
zB1q97/YevWXIwTYAP/0h+tASqirffamdLZHctx54iozfb/M3QuSU2c4i5fAEQEA
AYi2BBgBCAAgFiEEDpSiY4nGYN/owvMXBdCF2Yk0eacFAl19KF0CGwwACgkQBdCF
2Yk0eacnRgP7BKkW5dMJn8aHKxSGmhcpeGnfI1Rp4MorfjcwCz/gqgtoiqOY99SK
maij8J92E5sKpdMpZXhQfjZjVDb91oAW0TdUEXbVVBSjZ4Ku33QwFCm+Qzud/xaT
lQDrnYx05SITsBAAmOrwfBRo464WfU/0rlXziE2E4wDY4U6IYtbrAcQ=
=aNWV
-----END PGP PUBLIC KEY BLOCK-----
```

#### ASCII-armor Format

One last thing we should mention is that you can share your keys in binary format, or, often more conveniently, in a text format called ASCII-armor. You can print your public key to the console using the name or the email associated with the key as the last argument as in `gpg --export --armor MrAnderson`, or generate a file with your key in it using the following commands:

```shell
# generate public key file in binary format
$ gpg --export MrAnderson > myBinaryPubKey.gpg

# generate public key file in ASCII-armor format
$ gpg --export --armor MrAnderson > MrAndersonPubKey.asc

# print content of key file in ASCII-armor format to console
$ cat MrAndersonPubKey.asc
-----BEGIN PGP PUBLIC KEY BLOCK-----

mI0EXX0oXQEEAK/NyXBQxd1s9s3SYSVXMXfW0a3XR6JGwzf3ocfCu8OP12hVMvfo
BQfdj2WllNsWWpzNRJdeK2QCtLudykPNKtY7BuAk5bIWbGuVsNkWU/UmJZqijE0Q
aA+g2K1DFST5h4N12vLyLnN0On7RaJsTizR083E2QATsU/3VjP3Y3LUnABEBAAG0
IU1yQW5kZXJzb24gPE1yQW5kZXJzb25AZW1haWwuY29tPojOBBMBCAA4FiEEDpSi
Y4nGYN/owvMXBdCF2Yk0eacFAl19KF0CGwMFCwkIBwIGFQoJCAsCBBYCAwECHgEC
F4AACgkQBdCF2Yk0eadEqgQAm/LeK4BK77OPhy2jiouhmyhM922sATp07uP0s+WY
lJZZOlLSELc7FMn+iSzgsoBic432UFZVfJ5FZukn9oSSrvJagw7nx4Y3rIyUNDc+
0Dcw2lKH8WDqXXoANgWSewPb6P+kBq+ihVanaWgsG9a1nvb4/BoubMMoccAj3EaH
0Yq4jQRdfShdAQQArXj8/Ch3y//xeSPDXXu/HlylYT56s9gTOs8PzW/yeR8XAzGG
+YThFvMsRdfr8VYwr8fsNT+fS12IadaiwOX6ejs63LnE9WnyfnYdVTQO5ZTh61eU
zB1q97/YevWXIwTYAP/0h+tASqirffamdLZHctx54iozfb/M3QuSU2c4i5fAEQEA
AYi2BBgBCAAgFiEEDpSiY4nGYN/owvMXBdCF2Yk0eacFAl19KF0CGwwACgkQBdCF
2Yk0eacnRgP7BKkW5dMJn8aHKxSGmhcpeGnfI1Rp4MorfjcwCz/gqgtoiqOY99SK
maij8J92E5sKpdMpZXhQfjZjVDb91oAW0TdUEXbVVBSjZ4Ku33QwFCm+Qzud/xaT
lQDrnYx05SITsBAAmOrwfBRo464WfU/0rlXziE2E4wDY4U6IYtbrAcQ=
=aNWV
-----END PGP PUBLIC KEY BLOCK-----
```

## Task 3: Encrypting Messages

You can encrypt a message addressed to a specific recipient using their public key if it is in your keyring. For info on how to export your public key in order to share it with others as well as information about how to import other people's public keys, checkout [Task 1 from part 1]() of this series.

To encrypt the file `message.txt` in a way that only Morpheus will be able to decrypt it, we first check that his key in our keyring, then use the `--encrypt` command like so:

```shell
# check for the recipient's info in your keyring
# the second key here is our friend Morpheus' key we just imported
$ gpg --list-keys
pub   rsa1024 2019-09-14 [SC]
      0E94A26389C660DFE8C2F31705D085D9893479A7
uid           [ultimate] MrAnderson <MrAnderson@email.com>
sub   rsa1024 2019-09-14 [E]

pub   rsa1024 2019-09-14 [SC]
      5F357B756A571BF8A88567AF06898DFB48E3D899
uid           [ full ] Morpheus <morpheus@email.com>
sub   rsa1024 2019-09-14 [E]

# produce the encrypted file message.txt.asc
$ gpg --encrypt --armor -r Morpheus message.txt
```

Always make sure that the public key you use to encrypt is genuine! Call the person, verify on multiple channels, or message them on another encypted platform first before using their public key to encrypt a message. Note that you can enrypt a message to multiple public keys, but that will show up when people decrypt it (in other words you could not fake that a message was encrypted _only_ for someone when in fact it was also encrypted for someone else at the same time).

## Task 4: Decrypting Messages

Upon getting the encrypted file, our friend Morpheus could decrypt its content using

```shell
# print message to console
gpg --decrypt message.txt.asc

# send message to file
gpg --decrypt message.txt.asc > decryptedMessage.txt
```
