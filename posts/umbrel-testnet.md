---
title: "Keep an Always-On Testnet Node Using Umbrel"
date: "2020-11-01"
year: "2020"
tags: ["bitcoin"]
---

<a href="https://getumbrel.com/" target="_blank" rel="noopener noreferrer">Umbrel</a> is a user-friendly bitcoin node perfect for single board computers (e.g. Raspberry Pi boards, RockPros) at home. One of its most important uses is running full bitcoin and lightning daemons on a separate, always-on machine. These daemons allow you to connect your other bitcoin software (e.g. mobile and desktop wallets, block and mempool explorers) to them, and will serve these software the information they need to function without having to ping third-party services. This has positive repercussions for your privacy and self-determination on the bitcoin network.

> Note: this article was tested on Umbrel _v0.2.14_. As Umbrel and the software stack it relies on is very much in development, things will likely change over time. I will attempt to keep it up to date as new versions are released, but know that if you are using a different version of Umbrel, it is possible that the procedure explained here may not be exactly what you need. Feel free to <a href="https://twitter.com/thunderB__" target="_blank" rel="noopener noreferrer">reach out</a> if you're running into problems.

### Testnet
While most people use those types of nodes with bitcoin's mainnet, they can also be leveraged for testnet. Running a testnet node and getting comfortable with testnet in general has serious advantages, and is worth a bitcoiner's time and effort. One of the main advantages is how running a testnet node allow you to test the more complex bitcoin procedures you might want to learn without having to worry about spending/loosing real bitcoins. Another advantage is privacy, where it might be hard to find non-KYC coins to test with on mainnet, whereas it's easy to find such coins on testnet. Most serious bitcoin software offer the option to work with testnet coins, and as such allow you to discover apps at your own pace. Examples of such tricky things you might want to do with testnet before you do them with mainnet:
+ Multisignature schemes leveraging different hardware and software (Trezor, Coldcard, Cobo, Specter, Sparrow)
+ Opening and closing Lightning channels
+ Working with up-and-coming bitcoin features like DLCs

### On a normal Umbrel setup (Raspberry Pi, umbrel-os)
The thing to understand here is that Umbrel ships with its own operating system (called umbrelOS), which includes all the software your Umbrel needs to run. That OS also ships with an automatic start of your node at boot, and that node will run mainnet by default.

> If you are serious about running a testnet node, I recommend having a separate device for it. **DO NOT RUN THE COMMANDS BELOW IF YOU HAVE AN EXISTING WALLET SET UP ON YOUR UMBREL**, as they will delete your wallet files and potentially loose funds/create complications for you. Also, note that your node will not run both mainnet and testnet at the same time, and so if you are using Umbrel to connect your mainnet mobile or desktop wallets to, you will loose that ability as well (since your mainnet node will be disabled).

To turn the node into a testnet node, we need to do a few things:

1. Access the node directly through an ssh connection (not your browser)
2. Stop the Umbrel node (the stack is running mainnet by default)
3. Change some of the configuration files so as to fire testnet on boot by default
4. Delete the mainnet wallet and associated files, so as to force Umbrel to rebuild a wallet/backup for testnet upon launch of the dashboard in the browser

This is accomplished using the following commands:

```shell
cd ~/
sudo ./scripts/stop
sudo systemctl stop umbrel-startup

sudo rm ~/umbrel/.env
sudo rm ~/umbrel/statuses/configured

sudo NETWORK=testnet ./scripts/configure

sudo rm -r ~/umbrel/lnd/!(lnd.conf) 
sudo rm ~/umbrel/db/user.json
sudo rm -r ~/umbrel/db/umbrel-seed/seed

sudo systemctl start umbrel-startup
```

### On a custom Umbrel setup
If you have installed Umbrel on a different device without downloading the official umbrelOS image (see my [article on how to do just that on a RockPro64](https://thunderbiscuit.com/umbrel-rockpro/)), you're facing a slightly different action plan. Some of the problems (unrelated to testnet) people have run into have to do with the fact that on some devices, electrs requires more memory than the system has available for its indexing of the blockchain, and the process crashes. In umbrelOS, this is currently dealt with by a process called _memory swapping_, but you don't get that when you simply download the umbrel software stack without the OS. 

The way to deal with this is to add some memory arguments to the configuration files of the bitcoin daemon and the electrs server. These will slow down the initial bitcoin block download and the electrum server indexing, but will ensure your potentially low-powered device can handle the workload.

#### 1. Change the bitcoin config file
Change/update the following line in `./bitcoin/bitcoin.conf` (the default is currently `dbcache=1598`):
```shell
sudo nano ./bitcoin/bitcoin.conf

# inside bitcoin.conf
dbcache=20
```

#### 2. Change the electrum rust server config file
Add the following lines to `./electrs/electrs.toml`:
```toml
sudo nano ./electrs/electrs.toml

# inside electrs.toml
index_batch_size = 10
jsonrpc_import = true
```

#### 3. Fire up the whole setup
You're now ready to fire up the node. The steps here will depend on whether you have already run the node before or if it is your first time turning it on. The slight adjustment needed is because if you already have started Umbrel before, it has created a set of configurations that you need to overwrite/delete in order for the new changes in the config files to take effect.

```shell
# case 1: it's your first time firing up the node
sudo NETWORK=testnet ./scripts/start
```

```shell
# case 2: you have previously used the node
sudo NETWORK=tesnet ./scripts/stop 
# or sudo ./scripts/stop if you had been running mainnet

sudo rm ./.env
sudo rm ./statuses/configured

sudo NETWORK=testnet ./scripts/configure

sudo rm -r ./lnd/!(lnd.conf) 
sudo rm ./db/user.json
sudo rm -r ./db/umbrel-seed/seed

sudo NETWORK=testnet ./scripts/start
```

That's it! Your testnet node should be up and running.
