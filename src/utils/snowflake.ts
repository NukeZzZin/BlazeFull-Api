import { EventEmitter } from "events"; 
import logger from "./logger";

interface snowflake_config_interface {
    epoch: any;
    workerID: any;
    datacenterID: any;
    workerID_Bytes: any;
    datacenterID_Bytes: any;
    sequence: any;
    sequence_Bytes: any;
}

class Snowflake extends EventEmitter {
    config_super: snowflake_config_interface;
    start: number;
    sequence: bigint;
    workerID: bigint;
    datacenterID: bigint;
    workerIDShift: bigint;
    datacenterIDShift: bigint;
    timestampLeftShift: bigint;
    sequenceMask: bigint;
    timestamp: bigint;
    count: number;
    constructor(args: snowflake_config_interface) {
        super();
        this.config_super = {
            epoch: this.hydrate(args.epoch, 1577836800000n),
            workerID: this.hydrate(args.workerID, 0n),
            datacenterID: this.hydrate(args.datacenterID, 0n),
            workerID_Bytes: this.hydrate(args.workerID_Bytes, 0n),
            datacenterID_Bytes: this.hydrate(args.datacenterID_Bytes, 0n),
            sequence: this.hydrate(args.sequence, 0n),
            sequence_Bytes: this.hydrate(args.sequence_Bytes, 0n),
        },
        this.start = 0;
        this.count = 0;
        this.sequence = this.config_super.sequence;
        this.workerID = -1n ^ (-1n << this.config_super.workerID_Bytes);
        this.datacenterID = -1n ^ (-1n << this.config_super.datacenterID_Bytes);
        this.workerIDShift = this.config_super.sequence_Bytes;
        this.datacenterIDShift = this.config_super.sequence_Bytes + this.config_super.workerID_Bytes;
        this.timestampLeftShift = this.config_super.sequence_Bytes + this.config_super.workerID_Bytes + this.config_super.datacenterID_Bytes;
        this.sequenceMask = -1n ^ (-1n << this.config_super.sequence_Bytes);
        this.timestamp = -1n;
        this.validate();
    }

    public validate() {
        if (this.config_super.workerID > this.workerID || this.config_super.workerID < 0) return logger.error(`WorkerId can't be greater than ${this.workerID} or less than 0`);
        if (this.config_super.datacenterID > this.datacenterID || this.config_super.datacenterID < 0) return logger.error(`DatacenterID can't be greater than ${this.datacenterID} or less than 0`);
        this.start = Date.now();
    }

    public hydrate(args: bigint | number, Default: bigint | number) {
        if (typeof args !== "bigint") return BigInt(args);
        if (typeof args === "bigint") return BigInt(args);
        return BigInt(Default);
    }

    public GenerateUUID() {
        const localfunction = (arg): bigint => {
            let timestamp = BigInt(Date.now());
            while (timestamp <= arg) {
                timestamp = BigInt(Date.now());
            }
            return timestamp;
        }
        let timestamp = BigInt(Date.now());
        if (timestamp < this.timestamp) return logger.error(`Clock moved backwards. Refusing to generate id for ${(this.timestamp - timestamp)} ms.`);
        if (this.timestamp === timestamp) {
            this.sequence = (this.sequence + 1n) & this.sequenceMask;
            if (this.sequence === 0n) {
                timestamp = localfunction(this.timestamp);
            }
        } else {
            this.sequence = 0n;
        }
        this.timestamp = timestamp;
        this.count++;
        return ((((timestamp - this.config_super.epoch) << this.timestampLeftShift) | (this.config_super.datacenterID << this.datacenterIDShift) | (this.config_super.workerID << this.workerIDShift) | this.sequence)?.toString());
    }
}

const snowflake = new Snowflake({
    epoch: 1577836800000,
    workerID: 0,
    datacenterID: 0,
    workerID_Bytes: 5,
    datacenterID_Bytes: 5,
    sequence: 0,
    sequence_Bytes: 12,
});


export default snowflake;