---
title: "GPG for the Working Man — Part 2 (encryption)"
date: "2019-09-12"
year: "2019"
tags: ["gpg"]
---

The goal of this post is to get you up to speed on 2 of the main uses of GPG: cryptographically encrypting and decrypting data.

> Note: this post is the second in a series aimed at developing a functional use of GPG for the day to day tasks of anyone who cares about software. Check out [part 1](/gpg-part1) to learn about signing and verifying signatures.

GPG is a small open source piece of software that allows you to manage keys for cryptographic purposes. One important aspect of cryptographic keys is that they are simply numbers. Often really, really big numbers, but simple integers nonetheless. Another important aspect of cryptographic keys as used in GPG is that they come in pairs: a _public_ key and a _private_ key. Knowledge of these numbers (the keys) allows us to perform many tasks, 2 of which we'll tackle here:

1. Encrypt a message in a way that only a person with the knowledge of a specific key could decrypt.
2. Decrypt a message that was encrypted for a private key you own.

GPG does much more, but this post is really about those 2 basic tasks.

> You should not stop here on your journey to learning about GPG; for information on who invented this whole thing in the first place, go [here](); to understand the difference between GPG and PGP, check out [this article](); to extend your working knowledge further I recommend reading the GPG docs [here]().

## Priors

<em>This section is the same as the Priors section from [Part 1](). If you have already set up gpg and created a key, you can safely move on to the section on encrypting messages.</em>

First, make sure you have gpg installed on your computer. You can get it using homebrew (`brew install gpg`) on MacOS or using any of the package managers on Linux (`apt-get gpg` on Ubuntu for example).

```shell
gpg --version  # ensure gpg is installed on your computer
```

The first thing we'll do is create a key. I recommend creating an initial test key with a simple password to use for the rest of this tutorial, and deleting it afterwards.

```shell
gpg --full-generate-key  # generate a new key
```

The process of creating a new key requires we answer some question about key type and size, as well as associate some information with the key. Answer the few questions required to build a key and you should soon find that you now have a key available in gpg. To see what keys pairs are in your keyring, simply enter

```shell
$ gpg --list-keys

pub   rsa1024 2019-09-12 [SC]
      464E76FA16CB80C449C45F789781764F696BA7E2
uid           [ultimate] MrAnderson (I am a comment) <myemail@email.com>
sub   rsa1024 2019-09-12 [E]
```

We now have a key pair available to us for the tasks below. The `--list-key` command outputs some meta information about the key, as well as a fingerprint (the `464E76FA16CB80C449C45F789781764F696BA7E2` part). (what is the fingerprint? What is the difference between that and the public key?)

One last thing we should mention is that the public key is often shared with others for reasons we'll see further on; you can share your key in binary format, or, often more conveniently, in a text format called ASCII-armor.

```shell
# generate public key file in binary format
$ gpg --export MrAnderson > myBinaryPubKey.gpg

# generate public key file in ASCII-armor format
$ gpg --export --armor <key identifier> > userpubkey.asc

# print key in ASCII-armor format to console
$ cat MrAndersonPubKey.asc
-----BEGIN PGP PUBLIC KEY BLOCK-----

mI0EXXqVSgEEAKSFqG8a3Mp/nnZEQYwjJ939hXKe67DstJaoT2I2RjbHSPGzNq65
VJB6RYDiqkWtIxu2UxFklc5DXMH2W91v0OyItDXj7Duc3Lt+xQcGbIVpskR36H9w
dZZTD6wN85z8AwWElAqr9hVzkO+NCdaI+Kkhoxn82d3TSIpmoNpJ7+WFABEBAAG0
MnRvdGFsbHlSZWFsTmFtZSAoSSBhbSBhIGNvbW1lbnQpIDx0b3RhbEBnbWFpbC5j
b20+iM4EEwEIADgWIQRGTnb6FsuAxEnEX3iXgXZPaWun4gUCXXqVSgIbAwULCQgH
AgYVCgkICwIEFgIDAQIeAQIXgAAKCRCXgXZPaWun4s/lA/9LvWY4CDHKV0hh2ulH
l6dM6cpsscKj5rIyQceUwZLUYrRuQQzxLVBdUiEEwo+yMSenWENh/CpHKxrQJcs9
5ubqfFp4zzroYWe4VE2Cljlsapofkl3902iuhriusLaUMC0SIVlRehpvqjiPCGdA
ZW5oJXLgz8UeeiYxPrAS9UZI3LiNBF16lUoBBACtkqQxCWoTFBsVCH0ESHVUr1/7
fMi+HX/jnPscjsRa4PdukpZrhFA2VgMH5SkvIjoUSY8GDT1cGHH4aquaF9VFwNJY
Os8eCYwqqOOYy1lo4nALMjudsH30tIdKVaEJ0N8KMT6cN/MwFy8e2YM8pd306wLS
ueh+MUOyK7BAgM4gGQARAQABiLYEGAEIACAWIQRGTnb6FsuAxEnEX3iXgXZPaWun
4gUCXXqVSgIbDAAKCRCXgXZPaWun4vxBA/4+VximORFa0ND9ZYslyJ/ts9lFYwNT
0GvCjaWKYFb+3o0AU+s+VMTX3noq+dPYgXGL9eADdz7uvDjDMbT0rilE18WyN/ic
ves+AZPBwnoWnWiJ1pNmfNb1TRlDBXq3CkJmMuJkjgi99NLtDXt9X2b1HvsPUmAM
TfCUQJgt5l+59A==
=J8Z3
-----END PGP PUBLIC KEY BLOCK-----
```

To make the rest of this post a breeze, we'll also pretend we've created a public key called `MrAndersonPubKey.asc` and that we've recieved a firend's public key which we've saved under `morpheusPubKey.asc`.

## Encrypting Messages

You can encrypt a message addressed to a specific recipient using their public key if it is in your keyring like so:

```shell
# check for the recipient's info in your keyring
gpg --list-keys

gpg --encrypt --armor -r morpheus message.txt
# produces the file message.txt.asc
```

Always make sure that the public key you use to encrypt is genuine! Call the person, verify on multiple channels, or message them on another encypted platform first before using their public key to encrypt a message. Note that you can enrypt a message to multiple public keys, but that will show up when people decrypt it (in other words you could not fake that a message was encrypted _only_ for someone when in fact it was also encrypted for someone else at the same time).

## Decrypting Messages

Upon getting the encrypted file, your friend Morpheus could decrypt its content using

```shell
gpg --decrypt message.txt.asc > decryptedMessage.txt
```
