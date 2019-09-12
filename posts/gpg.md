---
title: "GPG for the Working Man"
date: "2019-09-12"
year: "2019"
tags: ["gpg"]
---

The goal of this post is to get you up to speed on 4 of the main uses of pgp: signing, verifying, encrypting, and decrypting data.

<br/>

GPG is a small piece of software that allows you to manage keys for cryptographic purposes. One important aspect of cryptographic keys is that they simply are numbers. Often really, really big numbers, but simple integers nonetheless. Another important aspect of cryptographic keys as used in PGP is that they come in pairs: a _public_ key and a _private_ key. Knowledge of these numbers (the keys) allows us to perform many tasks, 4 of which we'll tackle here:

<br/>

1. Signing a piece of data in a way that only a person in knowledge of a specific number (the private key) could have done. The validity of that signature is then easily verifiable by other parties.
2. Verify the validity of signature from someone else on a specific piece of data.
3. Encrypt a message in a way that only a person with the knowledge of a specific key could decrypt.
4. Decrypt a message that was encrypted for a key you own.

<br/>

PGP does much more, but this post is really about those 4 basic tasks.

<br/>

## Priors

First, make sure you have gpg installed on your computer. You can get it using homebrew (`brew install gpg`) on MacOS or any of the package managers on Linux (`apt-get gpg` on Ubuntu for example).

<br/>

```shell
# ensure gpg is installed on your computer
gpg --version
```

<br/>

```
gpg --list-keys           # list your keys
gpg --full-generate-key   # generate a new key

# generate public key file in ASCII-armor format
gpg --export --armor <key identifier> > userpubkey.asc
```

<br/>

To make this a breeze, I'll be using `myPubKey.gpg` and `friendPubKey.gpg`.

<br/>

## Task 1: Sign a document (without encrypting it)

Proof that the document was signed by the owner of a specific public key, and that the document was not tempered with. The person reading the signature needs to recognize the signature as yours, so they need to have your public key. This is really signing an _open_ document. There is no encryption of the document here.

`gpg --sign message.txt` outputs a new file called `message.txt.gpg` that contains the signature _and_ the original message. The message is not encrypted. Anyone can retrieve the message from this file, whether they have the fingerprint of the signator or not. See the contents of the file using `gpg -decrypt message.txt.gpg`, which will print them to the console. You can output the contents (not including the verification of the signature) to a file using `gpg --decrypt message.txt.gpg > message_signed.txt`. It will print the verification of the signature as the file is created, but the signature verification will not be included in the file. The file is now the recreated original file.

Notice that the file output by `gpg --sign message.txt` is in `.gpg` format, a binary format, and so it can be difficult to share or save. Another way to save the file is in ASCII-armor format using the `--armor` command like so: `gpg --sign --armor message.txt`. The output file will be `message.txt.asc`, and will look something like this:

```txt

```

<br/>

## Task 2: Verify the signature of a document

You can read a signed document without the public key of the signator, but you won't be able to validate its signature. `gpg --verify message.txt.asc`. To validate the signature, import the public key of the signature on your keyring `gpg --import friend_pubkey.asc`. If you import a key, it won't be certified by default (you might not _really_ know that the key is the key from the person who you think it belongs to). If you really are certain, you can sign that key yourself with your own private key. `gpg -sign-key friend_pubkey.asc`.

# verify the signature of a file

gpg --verify message.txt.gpg
gpg --verify message.txt.asc

# verify and print signed message (unencrypted)

gpg --decrypt message.txt.gpg # binary
gpg --decrypt message.txt.asc # ASCII-armor

# verify and send signed message to a file

gpg --decrypt message.txt.gpg > message.txt # binary
gpg --decrypt message.txt.asc > message.txt # ASCII-armor

# import a public key into your public keyring

gpg --import <pubkey.asc>

# sign a public key in your keyring with your own private key

gpg --sign-key <pubkey.asc>

# clearsign a message

gpg --clearsign message.txt

# signed a document using detached signature

gpg --detach-sign software.dmg

# verify detached signature

# signature and file are in the same directory, with the same name but different extension

gpg --verify software.dmg.sig

# encrypt a message

gpg --encrypt -r recipient@gmail.com message.txt # binary
gpg --encrypt --armor -r recipient@gmail.com message.txt # ASCII-armor

# decrypt an encrypted message

gpg --decrypt message.txt.asc

# decrypt message and send to a file

gpg --decrypt message.txt.asc > message.txt

## 3. Clearsign documents

Clearsigning means that the message and the signature are all there in the open in the file, and that the file is ASCII-armor encoded by default. It is the easiest way to sign and verify text.

## 4. Verify detached signatures

Most often used verification for software. That way you can download only the software if you want, and the signature is on the side. No need to decrypt.

## 5. Encrypt messages

You can encrypt a message addressed to a specific recipient using their public key. `gpg --encrypt -r recipient@email.com message.txt`.
Always make sure that the public key you use to encrypt is genuine! Call the person, verify on multiple channels, or message them on another encypted platform first before using their public key to encrypt a message. Note that you can enrypt a message to multiple public keys, but that will show up when people decrypt it (in other words you could not fake that a message was encrypted _only_ for someone when in fact it was also encrypted for someone else at the same time). Decrypt the message the following way: `gpg --decrypt message.txt.asc`

```

```
