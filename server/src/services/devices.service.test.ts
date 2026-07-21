import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseArpEntries, parseHostedNetworkInfo } from "./devices.service";

describe("parseHostedNetworkInfo", () => {
  it("extracts hosted-network status, client count, and client MAC addresses", () => {
    const output = `
Hosted network status
---------------------
Status: Started
SSID name: "HNet"
Number of clients: 1
    Client MAC Address: 00-11-22-33-44-55
`;

    assert.deepEqual(parseHostedNetworkInfo(output), {
      status: "Started",
      clientCount: 1,
      clientMacAddresses: ["00-11-22-33-44-55"],
    });
  });
});

describe("parseArpEntries", () => {
  it("maps ARP entries to normalized MAC addresses and IPs", () => {
    const output = `
Interface: 192.168.1.1 --- 0x2
  Internet Address      Physical Address      Type
  192.168.1.10          00-11-22-33-44-55     dynamic
  192.168.1.20          66-77-88-99-aa-bb     static
`;

    assert.deepEqual(
      parseArpEntries(output),
      new Map([
        ["00-11-22-33-44-55", "192.168.1.10"],
        ["66-77-88-99-aa-bb", "192.168.1.20"],
      ]),
    );
  });
});
