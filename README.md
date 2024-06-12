# Micro:bit WebUSB Radio Commands - Proof of Concept
I am sharing this as an example of how something can be done rather than a finished project, this was always going to be (to me) a proof of concept that would then form part of what I'm going to be working on next. This was a way that I could check that I had a working method of sending message to and receiving messages from a Micro:bit using the WebUSB API.

## High Level View

Ultimately this was all about getting the two ends to talk to each other using whatever method worked best and was most widely available. I had previously experimented with using the serial port that the microbit exposed when plugged in with a USB cable but that used locally installed software to communicate with the Micro:bit. I next started looking into the WebUSB API. It uses the same serial connection but I access it directly over USB.

I initially started experimenting with Javascript and setting up the connection myself with reasonable success. Then I came across Bill Siever's [microbit-webusb](https://github.com/bsiever/microbit-webusb) project on GitHub that handled back and forth communications. Not being one who like's re-inventing wheels I tweaked this library to fit my needs and included it in my project (Thanks Bill).

Next was creating a set of commands that could be sent over a serial connection, including any parameters, and writing code at each end that would know how to send / receive and process them. If you look in either index.html or microbit-RadioGateway.hex (written using blocks) that's what you'll find.

Finally I threw together a quick block based demo that would be my end Micro:bit that could send and receive radio message.

## Compoment View   

This project can be split into three parts, the browser interface, a Micro:bit being used as a "Radio Gateway" and another Micro:bit to be a device to send / receive messages.

!(https://upload.wikimedia.org/wikipedia/commons/6/67/USB_icon.svg)



## The Browser Inteface
The first thing to point out is that this relies on the WebUSB API which, at the time of writing, isn't supported in all browsers. On the desktop that currenly means Chrome & Edge yes, Safari & Firefox no. You can find the current status of browser support on [Can I Use, WebUSB](https://caniuse.com/webusb).

A security feature of the WebUSB API is that the page is served over a secure connection (https) or from localhost, you cannot just open the index.html page from your local drive. The easiest way to try it the project out is to open it from GitHub by following this link []().
