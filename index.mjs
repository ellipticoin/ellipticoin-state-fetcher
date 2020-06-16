import fetch from "node-fetch"
import cbor from "borc"
import {promises as fs} from "fs"
// const fsPromises = fs.promises;

let lastMemory = Buffer.alloc(0);

async function saveState() {
  let res = await fetch('http://localhost:8080/state');
  let state = await res.buffer()
  let {memory} = cbor.decode(state)
  let encodedMemory = cbor.encode(memory)
  if(Buffer.compare(lastMemory, encodedMemory) != 0) {
    var d = new Date();
    console.log("state changed")
    lastMemory = encodedMemory
    var datestring = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
    await fs.writeFile(`ellipticoin-state-${datestring}.cbor`, state)
  }
}

setInterval(saveState, 5000);
saveState()

