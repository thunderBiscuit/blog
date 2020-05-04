---
title: "Bitcoin Bytes — Legacy Transactions"
date: "2020-05-01"
year: "2020"
tags: ["bitcoin"]
---

Here is a hex dump of the raw bitcoin transaction [`e778e8765fdbb60f62e267de4705789f526a5fe9bb0c0f5e56ab4f566c5240eb`](https://blockstream.info/tx/e778e8765fdbb60f62e267de4705789f526a5fe9bb0c0f5e56ab4f566c5240eb):

```txt
010000000104dde43b0e4724f1e3b45782a9bfbcc91ea764c7cb1c245fba1fefa175c3a5d0010000006a4730440220519f7867349790ee441e83e545afbd25b954a34e0733cd4da3b5f1e5588625050220166730d053c3672973bcb2bb1a977b747837023b647e3af2ac9c15728b0681da01210236ccb7ee3a9f154127f384a05870c4fd86a8727eab7316f1449a0b9e65bfd90dffffffff025d360100000000001976a91478364a559841329304188cd791ad9dabbb2a3fdb88ac605b0300000000001976a914064e0aa817486573f4c2de09f927697e1e6f233f88ac00000000
```

You've seen bitcoin transactions expressed in this form if you've ever tried to dive into the more technical bitcoin books, or have just been lurking around in the bitcoin community for long enough. They seem arcane and of impenetrable complexity, but it turns out that that's not the case at all; the above transaction, for example, is composed of 15 small building blocks, each one easy to find and interpret.

Studying the structure of bitcoin transactions in their "true" form is a valuable quest for all bitcoiners. This article is written with the curious bitcoiner in mind looking to get a high level understanding of what exactly gets passed around from node to node on the network. Let's get to it.

## Priors

To really understand all pieces of a transaction, a basic grasp of 4 foundational, non-bitcoin concepts are important: **bytes and hexadecimal notation**, **endianness**, **variable-length fields**, and **varints**. I address all 4 of those in the collapsible sections below. 

If you are familiar with computer science in general you most definitely won't need this kind of entry level review, but if you're coming from another background and are not familiar with them, I think you'll find those enlightening, and they will most definitely serve you well on your journey into bitcoin.

<div class="wrap-collabsible">
  <input id="collapsible-0" class="toggle-0" type="checkbox">
  <label for="collapsible-0" class="lbl-toggle">Bytes and Hexes</label>
  <div class="collapsible-content-0">
    <div class="content-inner-0" style="font-size: 16px;">
      <p>
        You might have seen "raw" bitcoin transactions printed in hexadecimal format (the transaction above is an example of that). But of course computers only speak the language of bits (0s and 1s). A bitcoin transaction in it's computer-understandable form is therefore a string of binary digits. Moreover, those 0s and 1s are always kept in small groups of 8 bits, called <em>bytes</em>. Here is an example of a byte: <code class="language-text">1101 0110</code>. 
      </p>
      <p>
        The problem with binary code is that it's not easy for humans to parse. The transaction above (and it's not even a big one) written in binary format is exactly 1,800 digits (<code class="language-text">10101011100101000101100000110100000011101...</code>).
      </p>
      <p>
        But binary numbers are still numbers; if we write them for humans we can write them in any we want that works best. Decimal notation (our regular number system), Roman numerals, Korean characters. etc.
        Decimal notation would be an obvious candidate, but it turns out that it is not very convenient for working with bytes. Take for example the bytes <code class="language-text">1101 0110</code> and <code class="language-text">0000 0010</code>. In decimal notation, the first number is <code class="language-text">214</code>, whereas the second number is <code class="language-text">3</code>. In fact every byte, when written in decimal notation, will take between 1 and 3 digits. That's not convenient, because then you'd never know when a byte ends and when the next one starts—how many bytes is <code class="language-text">21431042</code>? There can be multiple interpretations.
      </p>
      <p>
        Instead, a preferred numbering system for writing bytes for human consumption is the <a href="https://en.wikipedia.org/wiki/Hexadecimal" target="_blank">hexadecimal number notation</a>. A full explanation is beyond the scope of this post, but you should know that the number of possible arrangements of 4 bits is 16, and that the hexadecimal notation system has exactly... 16 digits. They map out nice and tidy with <em>half a byte</em>.
      </p>
      <section style="display: flex; flex-wrap: wrap; justify-content: space-evenly;">
        <div>
          <pre class="language-python"><code class="language-python"><span class="token punctuation">0000  </span><span class="token comment">>>>  </span><span class="token unit">0</span>
<span class="token punctuation">0001  </span><span class="token comment">>>>  </span><span class="token unit">1</span>
<span class="token punctuation">0010  </span><span class="token comment">>>>  </span><span class="token unit">2</span>
<span class="token punctuation">0011  </span><span class="token comment">>>>  </span><span class="token unit">3</span></code></pre>
        </div>
        <div>
          <pre class="language-python"><code class="language-python"><span class="token punctuation">0100  </span><span class="token comment">>>>  </span><span class="token unit">4</span>
<span class="token punctuation">0101  </span><span class="token comment">>>>  </span><span class="token unit">5</span>
<span class="token punctuation">0110  </span><span class="token comment">>>>  </span><span class="token unit">6</span>
<span class="token punctuation">0111  </span><span class="token comment">>>>  </span><span class="token unit">7</span></code></pre>
        </div>
        <div>
          <pre class="language-python"><code class="language-python"><span class="token punctuation">1000  </span><span class="token comment">>>>  </span><span class="token unit">8</span>
<span class="token punctuation">1001  </span><span class="token comment">>>>  </span><span class="token unit">9</span>
<span class="token punctuation">1010  </span><span class="token comment">>>>  </span><span class="token unit">a</span>
<span class="token punctuation">1011  </span><span class="token comment">>>>  </span><span class="token unit">b</span></code></pre>
        </div>
        <div>
          <pre class="language-python"><code class="language-python"><span class="token punctuation">1100  </span><span class="token comment">>>>  </span><span class="token unit">c</span>
<span class="token punctuation">1101  </span><span class="token comment">>>>  </span><span class="token unit">d</span>
<span class="token punctuation">1110  </span><span class="token comment">>>>  </span><span class="token unit">e</span>
<span class="token punctuation">1111  </span><span class="token comment">>>>  </span><span class="token unit">f</span></code></pre>
        </div>
      </section>
      <p>
        Notice that we can now represent our bytes as two hexadecimal digits, for a clean notation. Each byte is two hexadecimal digits, like so:
      </p>
      <section style="display: flex; flex-wrap: wrap; justify-content: space-evenly;">
        <div>
          <pre class="language-python"><code class="language-python"><span class="token punctuation">0000 0101  </span><span class="token comment">>>>  </span><span class="token unit">05</span>
<span class="token punctuation">0001 1100  </span><span class="token comment">>>>  </span><span class="token unit">1c</span>
<span class="token punctuation">1110 0101  </span><span class="token comment">>>>  </span><span class="token unit">e5</span>
<span class="token punctuation">1101 1111  </span><span class="token comment">>>>  </span><span class="token unit">df</span></code></pre>
        </div>
      </section>
      <p>
        When you're looking at a big hexadecimal string, you're really just looking at a neat little representation of a bunch of bytes, with each block of two characters representing one byte. 
      </p>
    </div>
  </div>
</div>

<div class="wrap-collabsible">
  <input id="collapsible-1" class="toggle-1" type="checkbox">
  <label for="collapsible-1" class="lbl-toggle">Big-Endian and Little-Endian Ordering</label>
  <div class="collapsible-content-1">
    <div class="content-inner-1" style="font-size: 16px;">
    <p>
      <a href="https://en.wikipedia.org/wiki/Endianness" target="_blank">Endianness</a> refers to the order of bytes within a representation of a number. You can think of it as the "direction" in which bytes should be read for meaning, while understanding that either direction does not influence the ultimate meaning of the bytes. 
    </p>
    <p>
      Take for example the number <em>one thousand five hundred and ninety two</em>. You are probably used to reading a number like this in the following way: <code class="language-text">1592</code>. At the same time, if I told you that I had this weird habit of always writing my numbers from right to left, you would still know that <code class="language-text">2951</code> means <em>one thousand five hundred and ninety two</em>.
    </p>
    <p>
      It turns out that some computer architectures are more efficient when working with numbers if they are stored with the <em>least significant byte first</em> (the equivalent of reading right to left), and so a lot of the numbers we use when communicating with computers are "translated" to that format. We call this computer version of a number <em>little-endian</em>, because it starts with the <em>little end</em>. When shifting from big-endian to little-endian, it's the <em>bytes</em> that we shift. This means shifting the last two characters (remember that one byte equals two hexadecimal characters) for the two up front, and so on. 
    </p>
    <p>
      The number 220,000 in hexadecimal notation is written <code class="language-text">03 5b 60</code>, but expressed in little-endian it becomes <code class="language-text">60 5b 03</code>.
    </p>
    <p>
      A real life example would be our transaction id for this article, which if referred to within a bitcoin transaction will be written in its little-endian form, but if you try to look it up in a block explorer, you'll need it's "human", big-endian version:
    </p>
  <pre class="language-python">
<code class="language-python"><span class="token comment"># big endian</span>
<span class="token punctuation">e778e8765fdbb60f62e267de4705789f526a5fe9bb0c0f5e56ab4f566c5240eb</span>
<span class="token comment"># little endian</span>
<span class="token punctuation">eb40526c564fab565e0f0cbbe95f6a529f780547de67e2620fb6db5f76e878e7</span></code></pre>
  </div>
</div>

<div class="wrap-collabsible">
  <input id="collapsible-2" class="toggle-2" type="checkbox">
  <label for="collapsible-2" class="lbl-toggle">Variable-Length Fields</label>
  <div class="collapsible-content-2">
    <div class="content-inner-2" style="font-size: 16px;">
      <p>
        You'll notice that the bytes in a transaction are all glued together in one big continuous blob. How does the software know where an input start and where it ends? How does it know if a certain byte belongs to the number of bitcoin transmitted or to the receiving address? The flexibility offered by bitcoin transactions implies that there are an extremely rich number of combinations possible, and that the scripts required for unlocking utxos vary greatly in length.
      </p>
      <p>
        One way to deal with this uncertainty would be to give every field a set lenght in bytes. This is what the version field does, for example: the version number of a transaction is always written in the first 4 bytes of a transaction (see the <code class="language-text">01000000</code> number that starts the transaction below). In a lot of cases, however the length needed to transmit the necessay data differs widely between transactions: unlocking scripts for a simple Pay to Public Key hash might be 106 bytes long like in the transaction we are using in this post, but they can easily be 5 times that size on complex multisig scripts. Giving a fixed length to that data section would not only be inneficcient (a lot of transactions would not need that much space at all), it would also be limiting, because scripts would have to stay under that size.
      </p>
      <p>
        A better way to deal with this and keep both flexibility and efficiency is by using a small marker at the beginning of a variable-length section that will give the software an indication of the lenght of the  section to follow. Here is an example of a series of 6 bytes: <code class="language-text">05 e7 78 e8 76 5a</code>. If we knew that the first byte was a indicator byte for the length of the section, a plain-english reading of this would then look like this: 
        <ul>
          <li>
            <em>byte 1: </em><code class="language-text">05<span class="token comment"> >>> the following section is 5 bytes long</span></code>
          </li>
          <li>
            <em>bytes 2 to 6:</em><code class="language-text">e7 78 e8 76 5a<span class="token comment"> >>> data</span></code>
          </li>
        </ul>
      </p>
      <p>
        Bitcoin transactions use a mix of fixed-length fields and variable-length fields. I'll make note of which ones use which in the description of each parts.
      </p>
    </div>
  </div>
</div>

<div class="wrap-collabsible">
  <input id="collapsible-3" class="toggle-3" type="checkbox">
  <label for="collapsible-3" class="lbl-toggle">Varints</label>
  <div class="collapsible-content-3">
    <div class="content-inner-3" style="font-size: 16px;">
      <p>
        Variable Integers (varints) are a way to write a very wide range of numbers in a way that minimizes their cost on transaction space. 
      </p>
      <p>  
        To understand how they accomplish this, first note that the bigger the number we need to write down, the more bytes it requires. <em>Three</em> is written as <code class="token punctuation">00000010</code> (1 byte), whereas <em>two million twenty nine thousand five hundred and twelve</em> is written as <code class="token punctuation">000111101111011111001000</code> (3 bytes).
      </p>
      <p>
        The problem we are faced with is that all bytes are glued together in one long string of 0s and 1s, and the software needs to know exactly where each of the fields pertinent to a transaction start and end. One way to deal with this is to give fields a never-changing length, so that we always know when they end. This is what the version field does, for example: the version number of a transaction is always written in the first 4 bytes of a transaction (see the <code class="token punctuation">01000000</code> number that starts the transaction below). The problem with this approach is that if we sometimes need to accomodate numbers of great size, we will need to give the field a length with the ability to accomodate all of those numbers (say 8 bytes dedicated to a particular field). But if in most cases we only use the field for very small numbers, then a lot of those bytes are just wasted, because those small numbers only need 1 byte. If this type of field is required in multiple places in a transaction, all that waste starts to add up. Rather, we need a solution that will use _only the space required_ for the number we wish to write. This is what varints do; they use 1 byte for most of our use cases, and up to 9 bytes for the really big numbers we don't expect often.
      </p>
      <p>
        The way this is achieved is simple. A single byte can normally be used to represent the numbers 0 to 255. If the number we need represented (say, the number of inputs in a transaction) is _below_ 253, we write it in the first byte, and the software knows that that's all there is to it. If the number is big enough that it needs a few more bytes to write, we instead write _253_ in that first byte, which will be interpreted by the software as "read the next two bytes as the actual number I need to communicate". If the number is even bigger, we use 254 instead, meaning "read the next 4 bytes for the actual number", and if our number needs even more, we use 255, which implies the next 8 bytes are the actual representation of our number. Easy and efficient; most varints used in transactions never need to be more than one byte, but they can all grow to accomodate incredibly large numbers.
      </p>
    </div>
  </div>
</div>

## A Legacy Bitcoin Transaction

A "legacy" bitcoin transaction is the name we give a transaction that does not implement _Segregated Witness_, a newer form of transaction in which the "witness" data (fields 5 and 6 below) are put into their own special section (we say they are _segregated_, hence the name).

These legacy transactions are perfectly valid bitcoin transactions, but they are being used less and less because of the efficiency gains made by the segregated witness approach resulting in lower fees, as well as its fix of the _transaction malleability_ bug, enabling, among others, the creation of lightning channels. Legacy transactions are easy to identify because they involve unlocking utxo(s) belonging to addresses starting with a 1. 

This article breaks down a typical legacy transaction where one utxo is used and spent into two: one payment to a payee, and one payment to a change address. It contains 15 different fields, and I describe each of their purpose below.

<pre class="language-python">
<code class="language-python"><span class="token punctuation">01000000 </span><span class="token comment">01 </span><span class="token property">04dde43b0e4724f1e3b45782a9bfbcc91ea764c7cb1c245fba1fefa175c3a5d0 </span><span class="token variable">01000000 </span><span class="token important">6a </span><span class="token attr-name">4730440220519f7867349790ee441e83e545afbd25b954a34e0733cd4da3b5f1e5588625050220166730d053c3672973bcb2bb1a977b747837023b647e3af2ac9c15728b0681da01210236ccb7ee3a9f154127f384a05870c4fd86a8727eab7316f1449a0b9e65bfd90d </span><span class="token variable" style="color: #ab8fff;">ffffffff </span><span class="token comment">02 </span><span class="token string">5d36010000000000 </span><span class="token important">19 </span><span class="token unit">76a91478364a559841329304188cd791ad9dabbb2a3fdb88ac </span><span class="token string">605b030000000000 </span><span class="token important">19 </span><span class="token unit">76a914064e0aa817486573f4c2de09f927697e1e6f233f88ac </span><span class="token selector">00000000 </span></code>
</pre>

<pre class="language-python">
<code class="language-python"><span class="token comment">----- section 1: version number ---------------</span>
<span class="token punctuation">[1]   </span><span class="token punctuation">01000000             </span><span class="token comment">>>> version number</span>

<span class="token comment">----- section 2: inputs -----------------------</span>
<span class="token punctuation">[2]   </span><span class="token comment">01                   </span><span class="token comment">>>> number of inputs</span>
<span class="token punctuation">[3]   </span><span class="token property">04dde43b...75c3a5d0  </span><span class="token comment">>>> previous txid</span>
<span class="token punctuation">[4]   </span><span class="token variable">01000000             </span><span class="token comment">>>> output number in previous tx</span>
<span class="token punctuation">[5]   </span><span class="token important">6a                   </span><span class="token comment">>>> size of signature script</span>
<span class="token punctuation">[6]   </span><span class="token attr-name">47304402...65bfd90d  </span><span class="token comment">>>> signature script</span>
<span class="token punctuation">[7]   </span><span class="token" style="color: #ab8fff;">ffffffff             </span><span class="token comment">>>> sequence number</span>

<span class="token comment">----- section 3: outputs -----------------------</span>
<span class="token punctuation">[8]   </span><span class="token comment">02                   </span><span class="token comment">>>> number of outputs</span>
<span class="token punctuation">[9]   </span><span class="token string">5d36010000000000     </span><span class="token comment">>>> amount of output 0</span>
<span class="token punctuation">[10]  </span><span class="token important">19                   </span><span class="token comment">>>> size of locking script output 0</span>
<span class="token punctuation">[11]  </span><span class="token unit">76a91478...3fdb88ac  </span><span class="token comment">>>> locking script output 0</span>
<span class="token punctuation">[12]  </span><span class="token string">605b030000000000     </span><span class="token comment">>>> amount output 1</span>
<span class="token punctuation">[13]  </span><span class="token important">19                   </span><span class="token comment">>>> size of locking script output 1</span>
<span class="token punctuation">[14]  </span><span class="token unit">76a91406...233f88ac  </span><span class="token comment">>>> locking script output 1</span>

<span class="token comment">----- section 4: locktime ----------------------</span>
<span class="token punctuation">[15]  </span><span class="token selector">00000000             </span><span class="token comment">>>> nLocktime</span></code>
</pre>


### [1] transaction version number

This field specifies the type of transaction being transmitted. It is of **fixed-length** (4 bytes) and is **little-endian**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">01000000</code></p>
  <p>The field indicates that this transaction is of version 1.</p>
</div>

<br />

### [2] number of inputs

This field expresses how many inputs will be unlocked by the transaction. Each of those inputs will need to be identified (here with fields 3 and 4), and unlocked (here with fields 5 and 6). In our case there is only one input, and so we only need to go through this loop once, but in the case where there are many inputs, we repeat the fields 3 to 6 as many times as there are inputs. This field is a **varint**, is **little-endian**, and can grow up to 9 bytes.

<div class="example">
  <h6>In Our Example:</h6>
  <p><code class="language-text">01</code></p>
  <p>The byte indicates that the transaction unlocks only one UTXO.</p>
</div>
<br />

### [3] previous transaction id

This field expresses the transaction which contains the output to be unlocked by the unlocking script in the coming fields 5 and 6. It is of **fixed-length** (32 bytes), and is **little-endian**.

<div class="example">
  <h6>In Our Example:</h6>
  <p><code class="language-text">04dde43b0e4724f1e3b45782a9bfbcc91ea764c7cb1c245fba1fefa175c3a5d0</code></p>
  <p>
    Because the field is little-endian, if you wish to search for that transaction in a block explorer you'll need to convert it to big endian first: <a href="https://blockstream.info/tx/d0a5c375a1ef1fba5f241ccbc764a71ec9bcbfa98257b4e3f124470e3be4dd04" target="_blank"><code class="language-text">d0a5c375a1ef1fba5f241ccbc764a71ec9bcbfa98257b4e3f124470e3be4dd04</code></a>. A look at that transaction will reveal that there were 2 outputs to it. Which one of those two is unlocked by the signature script is defined in the next field.
  </p>
</div>
<br />

### [4] ouput number in previous transaction
Defining the transaction an output comes from is not precise enough—there might be more than one. We need to know which output from that transaction is being unlocked, and this field expresses that. It is of **fixed-length** (4 bytes), and is **little-endian**.

<div class="example">
  <h6>In Our Example:</h6>
  <p><code class="language-text">01000000</code></p>
  <p>
    This is the number 1 written in little endian, indicating that the output being unlocked is the second one in transaction <a href="https://blockstream.info/tx/d0a5c375a1ef1fba5f241ccbc764a71ec9bcbfa98257b4e3f124470e3be4dd04" target="_blank"><code class="language-text">d0a5c375a1ef1fba5f241ccbc764a71ec9bcbfa98257b4e3f124470e3be4dd04</code></a>. It is valid for 300k satoshis.
  </p>
</div>
<br />

### [5] size of the unlocking script

This field indicates the number of bytes taken by the unlocking script, the field that follows it. It is a **varint**, and can take up to 9 bytes.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">6a</code></p>
  <p>
    This byte is the hexadecimal representation of 106, meaning our unlocking script (field 6) will be 106 bytes long (212 hex characters).
  </p>

</div>

<br />

### [6] Unlocking script

You can think of the unlocking script as the key that unlocks the utxo. If any of the unlocking scripts fail for any of the input utxos, the whole transaction fails. If all unlocking scripts succeed, the signer has proven they have ownership of the coins, and the transaction can move forward to the next steps. This field is of **variable length**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text" style="margin-left: 0;">4730440220519f7867349790ee441e83e545afbd25b954a34e0733cd4da3b5f1e5588625050220166730d053c3672973bcb2bb1a977b747837023b647e3af2ac9c15728b0681da01210236ccb7ee3a9f154127f384a05870c4fd86a8727eab7316f1449a0b9e65bfd90d</code></p>
  <p>
    The unlocking script is written in a language called <em>Script</em>, a language unique to bitcoin. It is beyond the scope of this article to look at the exact unlocking script used in this transaction, but we know it was a valid script, since the transaction was indeed propagated by the network, and later on mined.
  </p>
</div>
<br />

### [7] sequence number

The sequence number is a field initially designed for a purpose it never fulfilled. Nowadays it is often disabled  by setting it to <code class="language-text">ffffffff</code>. It can used to signal that a transction  is replace-by-fee enabled as per <a href="" target="_blank">BIP 125</a>, by setting the field equal to any number below <code class="language-text">ffffffff -1</code>. In some cases, the field is used to set timelocks (to enable this, verion 2 of a transaction must be declared in field 1). It is of **fixed-length** (4 bytes) and is **little-endian**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">ffffffff</code></p>
  <p>The field is disabled in this transaction.</p>
</div>
<br />

### [8] number of outputs

This field expresses how many outputs the transaction will create. It is a **varint**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">02</code></p>
  <p>The transaction has two outputs.</p>
</div>
<br />

### [9] amount going to output 0

This field expresses the amount of bitcoin being locked in output 0, expressed in satoshis. It is a **fixed-length** field of 8 bytes, and is **little-endian**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">5d36010000000000</code></p>
  <p>Output 0 locks in 79,453 satoshis.
</div>

<br />

### [10] size of locking script for output 0

This field expresses the size of the locking script for output 0. It is a **varint**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">19</code></p>
  <p>This byte is the hexadecimal representation of 25, meaning our locking script will be 25 bytes long (50 hex characters)</p>
</div>
<br />

### [11] locking script for output 0

This field is the locking script for output 0. It is a **variable-length** field.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">76a91478364a559841329304188cd791ad9dabbb2a3fdb88ac</code></p>
  <p>We can think of this field as a of lock we put on output 0. It is written in Script, bitcoin's own programming language.</p>
</div>
<br />

### [12] amount going to output 1

This field expresses the amount of bitcoin being locked in output 1, expressed in satoshis. It is a **fixed-length** field of 8 bytes, and is **little-endian**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">605b030000000000</code></p>
  <p>Output 1 locks in 220,000 satoshis.</p>
</div>
<br />

### [13] size of locking script for output 1

This field expresses the size of the locking script for output 1. It is a **varint**.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">19</code></p>
  <p>This byte is the hexadecimal representation of 25, meaning our locking script will be 25 bytes long (50 hex characters).</p>
</div>
<br />

### [14] locking script for output 1

This field is the locking script for output 0. It is a variable-length field. This is a **variable-length** field.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">76a914064e0aa817486573f4c2de09f927697e1e6f233f88ac</code></p>
  <p>We can think of this field as a of lock we put on output 1. It is written in Script, bitcoin's own programming language.</p>
</div>
<br />

### [15] nLocktime

nLocktime field allows for a transaction to be unspendable until a certain point in the future. If the field is set to `00000000`, the transaction is spendable right away. If they field is any number _below_ 500 million, it is intepreted as a block height. If it is _above_ 500 million, it is interpreted as a Unix timestamp. Transactions with locktimes on them will not be propagated by nodes if they are not valid at the time a node see it, hence the sender must wait until the transaction is valid before broadcasting.

<div class="example">
  <h6>In our example:</h6>
  <p><code class="language-text">00000000</code></p>
  <p>In our example the nLocktime field is such that the transaction is spendable right away.</p>
</div>
<br />

## Some notes on the above transaction
The example used here is a type of transaction known as a Pay to Public Key Hash, or P2PKH. It is the simples form of transactions we see nowadays. The transaction hex has 450 characters, and the transaction is therefore 225 bytes in size.

## TXID

The txid (transaction identifier) is derived from hashing the transaction data twice using SHA256. You can test this with our example transaction right in your shell. The following command basically takes the hex dump of the transaction, converts it to binary, hashes it, then converts that result to binary again, and hashes it once more. It is then printed to console in little-endian, hex format. Notice that you'll need to convert it to big-endian if you want to use it in a block explorer!

```sh
echo 010000000104dde43b0e4724f1e3b45782a9bfbcc91ea764c7cb1c245fba1fefa175c3a5d0010000006a4730440220519f7867349790ee441e83e545afbd25b954a34e0733cd4da3b5f1e5588625050220166730d053c3672973bcb2bb1a977b747837023b647e3af2ac9c15728b0681da01210236ccb7ee3a9f154127f384a05870c4fd86a8727eab7316f1449a0b9e65bfd90dffffffff025d360100000000001976a91478364a559841329304188cd791ad9dabbb2a3fdb88ac605b0300000000001976a914064e0aa817486573f4c2de09f927697e1e6f233f88ac00000000 | xxd -revert -plain | sha256sum | xxd -revert -plain | sha256sum
```

## On Signing and Broadcasting
An often overlooked aspect of bitcoin transactions is how creating them and broadcasting them are two entirely separate tasks, and can be done independently. We mostly use wallets that will both construct and sign transactions and _also_ broadcast them for us, but it does not have to be so.

This is what projects like [TxTenna](https://txtenna.com/) and the [Lightning Network]() are leveraging. I plan to write more on those as I go!

I hope this article proved to be an interesting way to peel the first layer on bitcoin legacy transactions if you had not seen them this way before. Check out my article on _Segregated Witness_ transactions, a small but significant change in the way we build transactions that unlocks a ton of new potential use cases for bitcoin.
