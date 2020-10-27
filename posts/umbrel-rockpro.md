---
title: "Umbrel Node on RockPro64 Hardware"
date: "2020-10-01"
year: "2020"
tags: ["bitcoin"]
---

This post explores the setup required to run an [Umbrel bitcoin node](https://github.com/getumbrel/umbrel) (an easy and beginner-friendly node) on a [Pine64](https://www.pine64.org/) single board computer (SBC) called the [RockPro64](https://www.pine64.org/rockpro64/). The RockPro64 is a slightly more powerful version of a Raspberry Pi 4, and is built by the Pine64 organization, a non-profit that builds open hardware. They also happen to be very bitcoin-friendly.

A really great distro to run on a RockPro is [DietPi](https://dietpi.com/). DietPi is based off of Armbian, but is stripped down and ships extremely lean. From the very basics you can then install everything you need, but keeping the initial install minimal (about 600MB) ensures maximum performance for small SBCs.

## Install Scripts
_Tested on DietPi v6.32.2_  

This article aims to generalize the installation of Umbrel on a RockPro64 Single Board Computer using an awesome lightweight distro for SBCs: [DietPi](https://dietpi.com/).

I describe two scripts that together install the requirements for Umbrel. I provide these two scripts as as [GitHub Gist](https://gist.github.com/thunderbiscuit/e7f83cb62619e1368d6728e42949d21d) and explain how to download them using `curl` for extra convenience, but you absolutely do not need to go that route. After installing DiepPi, simply running the two scripts below line by line will generate the same result.

**Important: you need to run the first set of commands (script 1) as `root` and the second set (script 2) as your newly created user `umbrel`.**

<div class="wrap-collabsible">
  <input id="collapsible-1" class="toggle-1" type="checkbox">
  <label for="collapsible-1" class="lbl-toggle">Script 1: Change User and Move Home Directory</label>
  <div class="collapsible-content-1">
    <div class="content-inner-1" style="font-size: 16px;">
    <pre class="language-shell">
<code class="language-shell"><span class="token comment">#!/bin/bash</span>
<span></span>
<span class="token comment"># change default user dietpi for umbrel and assign new home directory</span>
$ sudo cp -r /home/dietpi $PWD/umbrelhome/
$ sudo usermod -l umbrel dietpi
$ sudo groupmod -n umbrel dietpi
$ sudo usermod -d $PWD/umbrelhome/ -m umbrel
$ sudo usermod -aG sudo umbrel
$ sudo chown --recursive umbrel:umbrel $PWD/umbrelhome/</code></pre>
  </div>
</div>

<div class="wrap-collabsible">
  <input id="collapsible-2" class="toggle-2" type="checkbox">
  <label for="collapsible-2" class="lbl-toggle">Script 2: Install Umbrel</label>
  <div class="collapsible-content-2">
    <div class="content-inner-2" style="font-size: 16px;">
    <pre class="language-shell">
<code class="language-shell"><span class="token comment">#!/bin/bash</span>
<span></span>
<span class="token comment"># dependencies</span>
$ sudo apt install --yes fswatch jq rsync curl make gcc libffi-dev libssl-dev python3-pip python3-dev
<span></span>
<span class="token comment"># docker</span>
$ curl -fsSL https://get.docker.com/ | sh
$ sudo usermod -aG docker umbrel
<span></span>
<span class="token comment"># docker-compose</span>
$ sudo pip3 install setuptools wheel
$ sudo pip3 install docker-compose
$ sudo chmod +x /usr/local/bin/docker-compose
<span></span>
<span class="token comment"># install umbrel software stack</span>
$ mkdir umbrel-node
$ cd umbrel-node/
$ curl -L https://github.com/getumbrel/umbrel/archive/v0.2.13.tar.gz | tar -xz --strip-components=1</code></pre>
  </div>
</div>

## Notes  
DietPi comes with [dropbear](https://matt.ucc.asn.au/dropbear/dropbear.html) (a lightweight ssh server) enabled, which means you can ssh into the RockPro64 out of the gate without any configuration from a computer on your local network, as long as the RockPro is connected to your router with an ethernet connection. Note that you'll need an IP scanner to discover the local IP address of the RockPro. You can of course also connect the RockPro to a screen and keyboard and work from there without sshing into it.  

## Prerequisite steps
Prior to running the scripts you should:
1. Flash the OS on an microSD card and pop it in the RockPro
2. Make sure the RockPro is connected to your router with an ethernet cable
3. Power it on!
4. You'll need to have mounted an external ssd drive to the RockPro to host the chain data. You can easily set that up in the TUI provided by DietPi. Simply start the `dietpi-launcher` and use the `DietPi-Drive_Manager` to format and mount your ssd.

## How to use the scripts
The first step is to navigate to the root directory of your external ssd (that's probably `/mnt/<name_of_your_ssd>/`). Running the first script from that location will ensure that the home directory for the `umbrel` user created is not on the micro SD card that has the operating system on (which would be too small for the chain data). _Make sure your external hard drive has enough space for your needs (a 1TB ssd is fine for a full mainnet node)._

The process consists of running two scripts. The first one creates the `umbrel` user with a home directory on the ssd drive and the second downloads all dependencies for Umbrel as well as the Umbrel software stack itself. You can use the formula `curl hyperlink > filename.sh` to recreate both scripts on your RockPro and then inspect them with `cat filename.sh`. You should make sure that the scripts you downloaded are identical to the ones above (in the yellow boxes) before running them.

**An important thing to know is that you need to run the first script as `root` and the second script as `umbrel`.**

### Part 1:
```shell
# root@DietPi
# make sure you are in the root directory of the external drive you wish to use for Umbrel
curl https://gist.githubusercontent.com/thunderbiscuit/e7f83cb62619e1368d6728e42949d21d/raw/aefd701106ed96eace760d4274d39ca6fa49ca63/create-umbrel-user.sh > create-umbrel-user.sh

# inspect the script
cat create-umbrel-user.sh

# run the script
source create-umbrel-user.sh
```

### Part 2:
Exit the ssh session and ssh back in with the `umbrel` user (e.g. `ssh umbrel@<ip_address>`).
```shell
# umbrel@DietPi
# make sure you are in the home directory for the umbrel user (umbrelhome/)
curl https://gist.githubusercontent.com/thunderbiscuit/e7f83cb62619e1368d6728e42949d21d/raw/b426e3a60252453ee6956dc8c8a4ed3a98c65920/install-umbrel-dietpi-rockpro64.sh > install-umbrel.sh

# inspect the script
cat install-umbrel.sh

# run the script
source instal-umbrel.sh
```

Once that is done, you'll need to reboot the RockPro for Docker to work:
```shell
sudo reboot
```

If the script above ran without any error, it will have created a directory called `umbrel-node`. Make sure you are in that directory and start your node directly using the following commands:

```shell
# you should be somewhere that looks something like:
# /mnt/<name_of_your_ssd>/umbrelhome/umbrel-node

sudo ./scripts/start                    # mainnet
sudo NETWORK=testnet ./scripts/start    # testnet
sudo NETWORK=regtest ./scripts/start    # regtest
sudo ./scripts/stop                     # stop node
```

## What are the scripts doing?
The scripts prepare the distro for Umbrel by accomplishing 6 distinct tasks:

1. Changing default `dietpi` user to `umbrel` and moving its home directory into the external drive outside of the SD card where your DietPi operating system is (this is necessary because Umbrel will add chain data and the electrs database to your home directory, which would fill up the SD card immediatly if it was kept there).
2. Install docker
3. Install docker-compose using pip3. This is necessary because docker-compose does not support the ARM architecture as of yet.
4. Give docker-compose executable permissions
5. Install other dependencies
6. Create a directory for the umbrel software stack called `umbrel-node` and download umbrel into it
