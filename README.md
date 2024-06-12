# Micro:bit WebUSB Radio Commands - Proof of Concept
I am sharing this as an example of how something can be done rather than a finished project, this was always going to be (to me) a proof of concept that would then form part of what I'm going to be working on next. This was a way that I could check that I had a working method of sending message to and receiving messages from a Micro:bit using the WebUSB API.

## High Level View

Ultimately this was all about getting the two ends to talk to each other using whatever method worked best and was most widely available. I had previously experimented with using the serial port that the Micro:bit exposed when plugged in with a USB cable but that used locally installed software to communicate with the Micro:bit. I next started looking into the WebUSB API. It uses the same serial connection but I access it directly over USB.

I initially started experimenting with Javascript and setting up the connection myself with reasonable success. Then I came across Bill Siever's [microbit-webusb](https://github.com/bsiever/microbit-webusb) project on GitHub that handled back and forth communications. Not being one who like's re-inventing wheels I tweaked this library to fit my needs and included it in my project (Thanks Bill).

Next was creating a set of commands that could be sent over a serial connection, including any parameters, and writing code at each end that would know how to send / receive and process them. If you look in either index.html or microbit-RadioGateway.hex (written using blocks) that's what you'll find.

Finally I threw together a quick block based demo that would be my end Micro:bit that could send and receive radio message.

## Component View   

This project can be split into three parts, the browser interface, a Micro:bit being used as a "Radio Gateway" and another Micro:bit to be a device to send / receive messages.

![](images/MicrobitWebUSB.png?raw=true)



### The Browser Interface
The first thing to point out is that this relies on the WebUSB API which, at the time of writing, isn't supported in all browsers. On the desktop that currently means Chrome & Edge yes, Safari & Firefox no. You can find the current status of browser support on [Can I Use, WebUSB](https://caniuse.com/webusb).

A security feature of the WebUSB API is that the page is served over a secure connection (https) or from localhost, you cannot just open the index.html page from your local drive. The easiest way to try it the project out is to open it from GitHub by following this link [Micro:bit WebUSB Radio Commands](https://rbilsland.github.io/MicrobitWebUSBRadioCommands-PoC/src/).

The page is broken down into five areas. At the top there is the Connect / Disconnect button. Below that, on the left are the radio commands while on the right are the radio events. The radio command button's will stay greyed out until connection is made. Below these is the last received Heartbeat date / time. When working this gets updated every 5 seconds upon receiving a ping from the gateway. Finally at the bottom is the console window showing you a log of what's happening.

### The Radio Gateway
This handles converting the serially send commands from the browser into radio commands and receiving radio events and sending them back serially to the browser. It also provides an initial handshake with the browser to make sure the gateway code is loaded and also a heartbeat ping every 5 seconds to prove it's still alive.

These are it's only tasks and just act's as a radio interface to the Micro:bit world for the browser. You can download the gateway hex file by right clicking and saving the following link [microbit-RadioGateway.hex](hex/microbit-RadioGateway.hex?raw=True) and if you want to have a look at the code here's an image [microbit-RadioGateway.png](images/microbit-RadioGateway.png?raw=True)

### The Demo Device 
This is just to provide an end point that the browser can interact with. It is able to receive strings, numbers or values (a string / number pair) and display them on the Micro:bit's screen. It's also able to send the string "Hello World" by pressing button A, the number 1234567890 by pressing button B and the value "ABC" = 123 by pressing the logo.

You can download the demo hex file by right clicking and saving the following link [microbit-RadioDemo.hex](hex/microbit-RadioDemo.hex?raw=True) and if you want to have a look at the code here's an image [microbit-RadioDemo.png](images/microbit-RadioDemo.png?raw=True)

## Running the Proof of Concept
Load the hex files onto a couple of Micro:bit's and connect the one containing the gateway code to the computer via a USB cable. Then visit the [Micro:bit WebUSB Radio Commands](https://rbilsland.github.io/MicrobitWebUSBRadioCommands-PoC/src/){:target="_blank"} page (**USING A COMPATIBLE BROWSER**) and click "Connect". You must make sure the Micro:bit connected to the computer hasn't already been paired with MadeCode, for example. If it has click the three dots to the right of the download button in MakeCode and choose to disconnect. If all else fails just un-plug the Micro:bit and plug it in again!

**Once connected remember to set the radio group to match the same the demo device is on, which is group 123**. Forget to do this and the browser will be transmitting it's commands with no-one listening. After this enjoy sending strings, number and values to the demo Micro:bit and receiving the same back. You'll notice Serial Number, Signal Strength and Time are displayed every time a message is received. This information has always been available but isn't usually accessed. The Serial Number will only contain 0 as the demo Micro:bit isn't set to transmit it's serial number with every message sent.

###Robert Bilsland