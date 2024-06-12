# Micro:bit WebUSB Radio Commands - Proof of Concept
I am sharing this as an example of how something can be done rather than a finished project, this was always going to be (to me) a proof of concept that would then form part of what I'm going to be working on next. This was a way that I could check that I had a working method of sending message to and receiving messages from a Micro:bit using the WebUSB API.

This example comes in 3 parts, first the browser interface, second a Micro:bit being used as a "Radio Gateway" and third another Micro:bit to be a device to send messages to / receive messages from.

## The Browser Inteface
The first thing to point out is that this relies on the WebUSB API which, at the time of writing, isn't supported in all browsers. On the desktop that currenly means Chrome & Edge yes, Safari & Firefox no. You can find the current status of browser support on [Can I Use, WebUSB](https://caniuse.com/webusb).

A security feature of the WebUSB API is that the page is served over a secure connection (https) or from localhost, you cannot just open the index.html page from your local drive. The easiest way to try it the project out is to open it from GitHub by following this link []().
