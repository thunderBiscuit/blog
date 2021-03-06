---
title: "GPG for the Working Man — Part 1 (signatures)"
date: "2020-01-01"
year: "2020"
tags: ["gpg"]
---

The goal of this article is to get you up to speed on two of the main uses of GPG: cryptographically signing and verifying signatures on data.

> Note: this post is the first in a series aimed at developing a functional use of GPG for the day-to-day tasks of anyone who cares about software. Check out [part 2](/gpg-part2) for the lowdown on how to encrypt and decrypt messages.

GPG stands for _GNU Privacy Guard_ and is a small open source piece of software that allows you to manage keys for cryptographic purposes. GPG implements the OpenPGP standard maintained by the Internet Engineering Task Force. In practice, the terms GPG, OpenPGP, and PGP are often used interchangably even though they probably shouldn't be. You can think of OpenPGP as email and GPG as one implementation of the email protocol (like Hotmail or Gmail).

One important aspect of cryptographic keys is that they are _simply numbers_. They are often really, really big numbers, but simple integers nonetheless. Another important aspect of cryptographic keys as used in GPG is that they come in pairs: a _public_ key and a _private_ key. Knowledge of these numbers (the keys) allows us to perform many tasks, two of which we'll tackle here:

1. Signing a piece of data in a way that only a person knowing a specific key could have done.
2. Verify the validity of a signature from someone else on a specific piece of data.

GPG does much more, but this post is really about those two basic tasks and their related options.

> There is much more to learn about privacy, encryption, and GPG than I cover in this series; for information on who invented this whole thing in the first place, check out [Phil Zimmermann's Wikipedia page](https://en.wikipedia.org/wiki/Phil_Zimmermann); for more on the difference between GPG and PGP, check out [this article](https://www.goanywhere.com/blog/2013/07/18/openpgp-pgp-gpg-difference); to dig deeper into the specifics of GPG, check out [their docs](https://gnupg.org/).

## Priors

#### Installing the Software

First, make sure you have GPG installed on your computer. You can get it on MacOS using homebrew (`brew install gpg`), on Linux using any of the package managers, or on Windows by downloading the binaries directly from the [GnuPG official website](https://gnupg.org/download/index.html). You will also need a bash terminal to interact with the software.

```shell
# if this returns a version number, you're good!
$ gpg --version
```

#### Creating Keys

The first thing that we want to do is create a key set (a public and a private key pair). I recommend creating an set of test keys with a simple password to use for the rest of this tutorial, and deleting it afterwards:

```shell
$ gpg --full-generate-key  # generate a new key
```

The process of creating a new key pair requires that we answer some question about key type and size, as well as associate some information with the keys. If you answer the few questions required to build keys, you should soon find that you now have a key set available in your GPG keyring. To see what keys are available, enter:

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

Both the binary format and the ASCII-armor format are representations of the same data, but you'll find that the ASCII-armor is much easier to share (for example you could copy/paste it in an email or a text message).

## Task 1: Sign a document (without encrypting it)

Signing a document (or any piece of data) creates proof that the document was signed by the owner of a specific public key, and that the document was not tampered with after the signature. Note that the signature is completely agnostic to the data it is signing, meaning that we can use GPG to sign sound data, text data, image data, or any other type of data we want.

The goal here is really to sign an _open_ document. There is no encryption of the document in this procedure. As such, the document is usable by anyone whether or not they can verify its signature.

One of the common objectives of signatures is to attest that a specific version of the data is being stored or sent across a network. Once a piece of data has been signed, changing a single bit in the data will render the signature invalid. This is why, for example, the lead maintainer of the bitcoin core software will sign the downloadable releases of the software. Once downloaded, you can test for yourself whether his or her signature is valid on the download you just performed. If the signature is valid, you are in posession of the exact same piece of code that he or she signed. If the signature is invalid, the download was tampered with on its way to you. You can use this as an assurance that the software you download is trustworthy without having to trust the network you download it on. Note that it does not prevent the signator from writing bugs or malware into the software at all—it only attests to the fact that the version in your possession is the same as the version that was signed, bit for bit.

Let us suppose you have a file called `message.txt` in your current directory with the content `hello, world`, and that you wish to sign it.

```shell
gpg --sign message.txt
```

outputs a new file in the same directory called `message.txt.gpg` that contains the signature _and_ the original message. The message is not encrypted. Anyone can retrieve the message from the file, whether they verify the signature or not.

Notice that the signed file is in `.gpg` format, a binary format. This can make it inconvenient to look at or share (try `cat message.txt.gpg` to see what I mean). Another very common way to save the file is in ASCII-armor format using the `--armor` command like so:

```shell
gpg --sign --armor message.txt
```

The output file will be `message.txt.asc`, and will look something like this:

```shell
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

You can then copy and paste this anywhere to share or store the signed message. For example you could post it publicly on a website, send it as a text, or even write it down on a piece of paper.

## Task 2: Verify the signature of a document

Let us assume someone has sent us a signed document (`message_from_Morpheus.txt.asc`) and we wish to verify its signature. We can use the `--verify` option to do so:

```bash
$ gpg --verify message_from_Morpheus.txt.asc
gpg: Signature made Sat 14 Sep 18:55:38 2019 EDT
gpg:                using RSA key 5F35BF8A88567B756A5F06898DFB48E3D8717A99
gpg:                issuer "morpheus@email.com"
gpg: Can't check signature: No public key
```

Note that if you simply have the file but not the public key of the signator in your keyring, the `--verify` command will state that the signature could not be verified as valid.

To validate the signature, we'll first have to import the public key of the signator on our GPG keyring. In this case let's assume your friend Morpheus just sent you his public key in ASCII-armor format (he knows how to export his key because he read Task 1 of this post), and the file is saved under `MorpheusPubKey.asc`. You can import his key in your keyring using:

```shell
$ gpg --import morpheusPubKey.asc
gpg: key 06898DFB48E3D899: public key "Morpheus <morpheus@email.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
```

Now if you list your keys, you'll find you have 2 keys in your keyring:

```
$ gpg --list-keys
pub   rsa1024 2019-09-14 [SC]
      0E94A26389C660DFE8C2F31705D085D9893479A7
uid           [ultimate] MrAnderson <MrAnderson@email.com>
sub   rsa1024 2019-09-14 [E]

pub   rsa1024 2019-09-14 [SC]
      5F357B756A571BF8A88567AF06898DFB48E3D899
uid           [ unknown] Morpheus <morpheus@email.com>
sub   rsa1024 2019-09-14 [E]
```

When first importing a key, it won't be _certified_ by default (GPG does not assume you _really_ know that the key is the key from the person who it says it belongs to). The key could have been tampered with on its way to you, and anyone can create keys with anyone else's name. GPG does not, in any way, verify that you are the person who's name you are using to create a key.

It is recommended that you check that the key in your keyring belongs to the person you think it does using multiple sources, or that you take the time to call or text the person to verify. Once that is done, you can sign that key _yourself_ with your own private key, adding a layer of protection to the validity of your friend's public key in your key ring.

```shell
gpg --sign-key Morpheus
```

This will identify the key as `[full]` instead of `[unknown]` in our keyring. Notice that we do not need to sign a public key to use it in signature verification; it simply is an added layer of certainty when verifying signatures.

Once we have the public key of the signator of the piece of data we wish to verify in our keyring, we can verify the signature on any file in one line of code. GPG will print the result of the signature verification on the console. In the case of a valid signature, it would look like this:

```bash
gpg --verify message_from_Morpheus.txt.asc
gpg: Signature made Sat 14 Sep 18:55:38 2019 EDT
gpg:                using RSA key 5F357AF0687B756A571BF8A885698DFB48E3D899
gpg:                issuer "morpheus@email.com"
gpg: Good signature from "Morpheus <morpheus@email.com>" [full]
```

To see the content of the message, you'll want to either print it to the console or create a new file with the original message in it.

```shell
$ gpg --decrypt message.txt.asc
what's up dog?
gpg: Signature made Sat 14 Sep 18:55:38 2019 EDT
gpg:                using RSA key 5F357AF0687B756A571BF8A885698DFB48E3D899
gpg:                issuer "morpheus@email.com"
gpg: Good signature from "Morpheus <morpheus@email.com>" [full]
```

which will print it to the console, as well as print the result of the signature verifcation. You could have used `--decrypt` on a message without the public key in your keyring and GPG would still have printed the message, but it would have told you that it could not verify the signature the same way as it did above with the `--verify` command.

Anyone in posession of the file can also output the original data to a file using

```shell
$ gpg --decrypt message_from_Morpheus.txt.asc > Morpheus_message_only.txt
gpg: Signature made Sat 14 Sep 18:55:38 2019 EDT
gpg:                using RSA key 5F357AF0687B756A571BF8A885698DFB48E3D899
gpg:                issuer "morpheus@email.com"
gpg: Good signature from "Morpheus <morpheus@email.com>" [full]

# the cat command prints to console the contents of a file
$ cat Morpheus_message_only.txt
what's up dog?
```

This will print the verification of the signature to the console as the file is created, but the signature verification will not be included in the newly created file; the new file is now an exact replica of the original file.

## Extras

### Clearsign

Note that the signature file build in ASCII-armor format in [_Task 1_](#) does not contain a human readable version of the original data (in this case the string `hello, world`). The file is not encrypted, but you'll need gpg installed and a command to show its content.

```bash
# create a signature file named message.txt.asc
$ gpg --sign --armor message.txt
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

Using the `--clearsign` command on ASCII-armor format to sign a document (rather than the `--sign` command) will include the original data in the signed file. The resulting file keeps the signed message at the top, making it easy to parse, whether we verify the signature or not.

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

Detached signatures have one great advantage over normal signatures: because they are separate, they are not mandatory in order to use the data. The signatures for popular software (say, Python, for example), are downloaded separately, and therefore do not interfere with one's ability to simply download and start using the software. On the other hand, verifying the validity of such signatures is just as easy as it is with regular signatures.

We create a detached signature using the following command, which will produce a small file called `mySoftware.dmg.sig`:

```shell
$ gpg --detach-sign mySoftware.dmg
$ ls
mySoftware.dmg
mySoftware.dmg.sig
```

Now let us assume we have downloaded a piece of software and its associated signature (`python.dmg` and `python.dmg.sig`). Provided the files are in the same directory and have the same name, we can verify the signature like so:

```shell
$ ls
python.dmg
python.dmg.sig

$ gpg --verify software.dmg.sig
gpg: assuming signed data in 'python.dmg'
gpg: Signature made Sat 14 Sep 19:28:09 2019 EDT
gpg:                using RSA key 0E49C5D08660D9A2638FE8C2F31705D9893479A7
gpg:                issuer "mranderson@email.com"
gpg: Good signature from "MrAnderson <MrAnderson@email.com>" [ultimate]
```

That's it! Check out [part 2](/gpg-part2) for how to encrypt and decrypt data using GPG.
