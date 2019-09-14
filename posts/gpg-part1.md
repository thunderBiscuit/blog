---
title: "GPG for the Working Man — Part 1 (signatures)"
date: "2019-09-12"
year: "2019"
tags: ["gpg"]
---

The goal of this post is to get you up to speed on 2 of the main uses of pgp: cryptographically signing and verifying signatures on data. Check out [part 2](./posts/gpg-part1) for the lowdown on how to encrypt and decrypt messages using gpg.

GPG is a small piece of software that allows you to manage keys for cryptographic purposes. One important aspect of cryptographic keys is that they simply are numbers. Often really, really big numbers, but simple integers nonetheless. Another important aspect of cryptographic keys as used in PGP is that they come in pairs: a _public_ key and a _private_ key. Knowledge of these numbers (the keys) allows us to perform many tasks, 2 of which we'll tackle here:

1. Signing a piece of data in a way that only a person in knowledge of a specific number (the private key) could have done. The validity of that signature is then easily verifiable by other parties.
2. Verify the validity of signature from someone else on a specific piece of data.

PGP does much more, but this post is really about those 2 basic tasks.

> These posts are aimed at developing a functional use of GPG for the day to day tasks of anyone who cares about software. But you should not stop here on your journey to learning about PGP; for information on who invented this whole thing in the first place, go [here](); to extend your working knowledge further I recommend reading the docs of PGP [here]().

## Priors

First, make sure you have gpg installed on your computer. You can get it using homebrew (`brew install gpg`) on MacOS or any of the package managers on Linux (`apt-get gpg` on Ubuntu for example).

```bash
# ensure gpg is installed on your computer
gpg --version
```

The first thing we'll do is create a key. I recommend creating an initial test key with a simple password to use for the rest of this tutorial, and deleting it afterwards.

```bash
gpg --full-generate-key   # generate a new key
```

The process of creating a new key requires we answer some question about key type and size, as well as associate some information with the key. Answer the few questions required to build a key and you should soon find that you now have a key available in gpg. To see what keys pairs are in your keyring, simply enter

```bash
$ gpg --list-keys

pub   rsa1024 2019-09-12 [SC]
      464E76FA16CB80C449C45F789781764F696BA7E2
uid           [ultimate] MrAnderson (I am a comment) <myemail@email.com>
sub   rsa1024 2019-09-12 [E]
```

We now have a key pair available to us for the tasks below. The `--list-key` command outputs some meta information about the key, as well as a fingerprint (the `464E76FA16CB80C449C45F789781764F696BA7E2` part). (what is the fingerprint? What is the difference between that and the public key?)

One last thing we should mention is that the public key is often shared with others for reasons we'll see further on; you can share your key in binary format, or, often more conveniently, in a text format called ASCII-armor.

```bash
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

## Task 1: Sign a document (without encrypting it)

Signing a document (or any piece of data) creates proof that the document was signed by the owner of a specific public key, and that the document was not tempered with. Note that the signature is completely agnostic to the data it is signing. We can use gpg to sign sound data, text data, images, etc.

The goal here is really to sign an _open_ document. There is no encryption of the document in this procedure. As such, the document is usable by anyone whether or not they can verify its signature.

One of the common objectives of signatures is to attest that a specific version of the data is being stored or sent across a network. Once a piece of data has been signed, the change of a single bit in the data will render the signature invalid. This is why, for example, the lead maintainer of bitcoin core will sign the downloadable releases of the software. Once fully downloaded, you can test whether his signature is valid on the download you just performed; if the signature is valid, you are in posession of the exact same piece of code that he signed. This is useful because you can use it as an assurance that the software you just downloaded was not tampered with in the process of downloading.

Let us suppose you have a file called `message.txt` you wish to sign.

```bash
gpg --sign message.txt
```

outputs a new file in the same working directory called `message.txt.gpg` that contains the signature _and_ the original message. The message is not encrypted. Anyone can retrieve the message from this file, whether they verify the signature or not.

You can see the contents of the file using

```bash
gpg -decrypt message.txt.gpg
```

which will print it to the console. You can also output the original data (the message in this case) to a file using

```bash
gpg --decrypt message.txt.gpg > message_signed.txt
```

This will print the verification of the signature to the console as the file is created, but the signature verification will not be included in the file. The file is now the recreated original file.

Notice that the file output by `gpg --sign message.txt` is in `.gpg` format, a binary format, and so it can be inconvenient to share. Another way to save the file is in ASCII-armor format using the `--armor` command like so:

```bash
gpg --sign --armor message.txt
```

The output file will be `message.txt.asc`, and will look something like this:

```bash
-----BEGIN PGP MESSAGE-----

owGbwMvMwME4vbHMPzN7+SPGNbJJ3LmpxcWJ6al6JRUlsVVLizNSc3LydRTK84ty
UjqOsDAwcjDoiSmyuPmV/RI73XDE80h8BUw7KxNIg4BMSX5JYo5Dem5iZo5ecn4u
AxenAExJ2E7mf/orZmwoeTJ1vspC35XrYvfoisoilj0k3uqnmdkfHX2t0eW0NeQN
TNi39keSVeD2utSvOzfZaoXsLUlekmUt7DGhg2lCRZmm53sHM58PFitPqmXNqOsU
+cjRljPzQHXgcfUbjDOmr3nvkbApSlp3yo53XS/e/0vgEFzFq+Y1oUwx4OqrJ+/9
eQA=
=c82p
-----END PGP MESSAGE-----

```

You can then copy and paste this anywhere to share or store the signed message, including email, or text.

## Task 2: Verify the signature of a document

You can read a signed document without the public key of the signator, but you will not be able to validate its signature.

```bash
gpg --verify message.txt.asc
# will return an error stating that you do not posess the public
# key required to validate the signed document
```

To validate the signature, import the public key of the signator on your gpg keyring (in this case let's assume it's a friend who just sent you their public key in ASCII-armor format):

```bash
gpg --import morpheusPubKey.asc
```

When first importing a key, it won't be "certified" by default (gpg does not assume you _really_ know that the key is the key from the person who it says it belongs to). They key could have for example been tampered with on its way to you.

If you really are certain (it is recommended that you check using multiple sources, or that you take the time to call and text the person to verify that the fingerprint is indeed the right one), you can sign that key yourself with your own private key, adding a layer of protection to the validity of your friend's public key in your key ring.

```shell
gpg -sign-key morpheusPubKey.asc
```

Once you have the public key of the signator of the piece of data you wish to verify, you can do so in one line of code:

```bash
gpg --verify message.txt.asc
```

GPG will print the result of the signature verification on the console. In the case of a valid signature, it would look like this:

```bash
gpg: Signature made Thu 12 Sep 16:07:15 2019 EDT
gpg:                using RSA key 0294857274CB80C449C45F789781764F696BA7E2
gpg:                issuer "email@email.com"
gpg: Good signature from "MrAnderson (I am a comment) <email@email.com>" [ultimate]
```

To see the content of the message, you'll want to either print it to the console or create a new file with the original message in it. Note that all the following commands will also print the result of the signature verification to the console.

```shell
# print to console, from binary format
gpg --decrypt message.txt.gpg

# print to console, from ASCII-armor format
gpg --decrypt message.txt.asc

# build into a file, from ASCII-armor format
gpg --decrypt message.txt.asc > message.txt
```

## Extras

### Clearsign

Note that the signature file build in ASCII-armor format does not contain a human readable version of the original data (in this case the string `hello, world`). The file is not encrypted, but you'll need another command to show its content.

```bash
# create a signature file named message.txt.asc
$ gpg --sign --armor message.txt

# the cat command prints to console the contents of a file
$ cat message.txt.asc

-----BEGIN PGP MESSAGE-----

owGbwMvMwME4vbHMPzN7+SPGNbJJ3LmpxcWJ6al6JRUlsVXfJmak5uTk6yiU5xfl
pHQcYWFg5GDQE1NkcfMr+yV2uuGI55H4Cph2ViaQBgGZkvySxByH9NzEzBy95Pxc
Bi5OAZiSV+3M/11+bLr0h3OFrsyTxPfv3irrfRX0m/U3aOXlwwd/KCju8Od59+5J
uGP84n0KOQbvjGbnvv31R7Nh1tz3b1r3aQks4Fglndb581JBIMN0M/dPxaKejOzH
61tOVRS3Kepk1L77tnv/XkeftjcHA1mrm0WCrS9sOlX2YEOg2Kt3HuY5nop7g9Xn
nwMA
=/jWM
-----END PGP MESSAGE-----
```

Using the `--clearsign` command rather than the `--sign` one on ASCII-armor format to sign a document will include the original data in the signed file. Notice how the resulting file keeps the signed message at the top, making it easy to parse, whether we verify the signature or not.

```bash
$ gpg --clearsign --armor message.txt
$ cat message.txt.asc

-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

hello, world
-----BEGIN PGP SIGNATURE-----

iMQEAQEIAC4WIQRGTnb6FsuAxEnEX3iXgXZPaWun4gUCXXr2FxAcdG90YWxAZ21h
aWwuY29tAAoJEJeBdk9pa6fi038D/1dXYUkFlKak1jRH369BjU5UaSmjiJvoWM8j
tQW78RVuYlOosL7bRSzgXJK1YH4hiz4rj3UWlbwRmF6s+UEu9wfDisHssHEiijru
LqCZpsWEDkzihjVwKSRz1UNIm1Egg4jyEV2ZY32dJnveN6wCiB1ABMe1zvB3G2cI
72Y3KOLr
=nKbM
-----END PGP SIGNATURE-----
```

### Detached Signatures

A popular way to sign software is through the use of _detached signatures_. A detached signature is a small file that sits _external_ to the actual softare or piece of data being signed.

Detached signatures have one great advantage over normal signatures; because they are separate, they are not mandatory in order to use the data. The signatures for popular software like Python, for example, are downloaded separately and, therefore do not interfere with one's ability to simply download and start using. On the other hand, verifying the validity of such signatures is just as easy as with regular signatures.

We detach sign data using the following command, which will produce a small file called `mySoftware.dmg.sig`:

```bash
gpg --detach-sign mySoftware.dmg
```

Now let us assume we have downloaded a piece of software and its associated signature (`python.dmg` and `python.dmg.sig`). Provided the files are in the same directory and have the same name, we can verify the signature

```bash
# list files
$ ls
software.dmg
software.dmg.sig

$ gpg --verify software.dmg.sig
gpg: assuming signed data in 'message.txt'
gpg: Signature made Thu 12 Sep 22:20:43 2019 EDT
gpg:                using RSA key 464E76FA16CB80C449C45F789781764F696BA7E2
gpg:                issuer "total@gmail.com"
gpg: Good signature from "totallyRealName (I am a comment) <total@gmail.com>" [ultimate]
```
