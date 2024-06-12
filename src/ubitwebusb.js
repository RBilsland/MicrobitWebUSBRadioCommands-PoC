
/*
 * JavaScript functions for interacting with micro:bit microcontrollers over WebUSB
 * (Only works in Chrome browsers;  Pages must be either HTTPS or local)
 */


const MICROBIT_VENDOR_ID = 0x0d28
const MICROBIT_PRODUCT_ID = 0x0204

/*
   Open and configure a selected device and then start the read-loop
 */
async function uBitOpenDevice(device, callback) {
    const transport = new DAPjs.WebUSB(device)
    const target = new DAPjs.DAPLink(transport)
    await target.connect()
    await target.setSerialBaudrate(115200)
    device.target = target;   // Store the target in the device object (needed for write)
    device.callback = callback // Store the callback for the device
    callback("connected", device, null)    

    // Cite: https://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
    // String.prototype.hexEncode = function(){
    //     var hex, i;
    
    //     var result = "";
    //     for (i=0; i<this.length; i++) {
    //         hex = this.charCodeAt(i).toString(16);
    //         result += ("000"+hex).slice(-4);
    //     }
    
    //     return result
    // }

    let lineParser = () => {
        let firstNewline = buffer.indexOf("\n")
        if(firstNewline>=0) {
            let messageToNewline = buffer.slice(0,firstNewline)
            let now = new Date() 
            // Deal with line
            // This has been simplified to just split a line into parts and then pass that back
            let commandParts = messageToNewline.split(String.fromCharCode(30))

            let dataBundle = {
                time: now,
                data: commandParts
            }

            callback(commandParts.length == 0 ? "empty" : "command", device, dataBundle);

            buffer = buffer.slice(firstNewline+1)  // Advance to after newline
            firstNewline = buffer.indexOf("\n")    // See if there's more data
            // Schedule more parsing
            if(firstNewline>=0) {
                setTimeout(lineParser, 10)                        // If so, parse it
            }
        }

    }

    let buffer=""                               // Buffer of accumulated messages
    const ws = / *\r\n/g
    target.on(DAPjs.DAPLink.EVENT_SERIAL_DATA, data => {
        buffer += data;
        buffer = buffer.replace(ws, "\n")
        if(data.includes("\n"))
            setTimeout(lineParser, 10) 
    });
    target.startSerialRead(1)
    return Promise.resolve()
}


/**
 * Disconnect from a device 
 * @param {USBDevice} device to disconnect from 
 */
async function uBitDisconnect(device) {
    if(device) {
        try {
            await device.target.stopSerialRead()
        } catch(error) {
            // Failure may mean already stopped
        }
        try {
            await device.target.disconnect()
        } catch(error) {
            // Failure may mean already disconnected
        }
        try {
            await device.close()
        } catch(error) {
            // Failure may mean already closed
        }
        // Call the callback with notification of disconnect
        device.callback("disconnected", device, null)
        device.callback = null
        device.target = null
    }
}

/**
 * Send a string to a specific device
 * @param {USBDevice} device 
 * @param {string} data to send (must not include newlines)
 */
function uBitSend(device, data) {
    if(!device.opened)
        return
    let fullLine = data+'\n'
    device.target.serialWrite(fullLine)
}


/**
 * Callback for micro:bit events
 * 
 
   Event data varies based on the event string:
  <ul>
   <li>"connection failure": null</li>
   <li>"connected": null</li>
   <li>"disconnected": null</li>
   <li>"error": error object</li>
   <li>"console":  { "time":Date object "data":string}</li>
   <li>"empty": { "time":Date object "data":string[]}</li>
   <li>"command": { "time":Date object "data":string[]}</li>
  </ul>

 * @callback uBitEventCallback
 * @param {string} event ("connection failure", "connected", "disconnected", "error", "console", "empty", "command" )
 * @param {USBDevice} device triggering the callback
 * @param {*} data (event-specific data object). See list above for variants
 * 
 */


/**
 * Allow users to select a device to connect to.
 * 
 * @param {uBitEventCallback} callback function for device events
 */
function uBitConnectDevice(callback) { 
    navigator.usb.requestDevice({filters: [{ vendorId: MICROBIT_VENDOR_ID, productId: MICROBIT_PRODUCT_ID }]})
        .then(  d => { if(!d.opened) uBitOpenDevice(d, callback)} )
        .catch( () => callback("connection failure", null, null))
    
}

//stackoverflow.com/questions/5892845/how-to-load-one-javascript-file-from-another
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'dap.umd.js';
document.getElementsByTagName('head')[0].appendChild(newScript);

navigator.usb.addEventListener('disconnect', (event) => {
    if("device" in event && "callback" in event.device && event.device.callback!=null && event.device.productName.includes("micro:bit")) {
        uBitDisconnect(event.device)
    }
 })