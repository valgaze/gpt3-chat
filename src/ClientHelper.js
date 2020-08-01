import axios from "axios";
export class ClientHelper {
    constructor(config) {
        this.backend = config.backend;
        this.axiosInst = axios.create({
            baseURL: this.backend,
        });
    }

    async send(payload) {
        const configuration = {
            method: "POST",
            data: payload,
        };

        let reply = await this.axiosInst(configuration).catch((e) => {
            throw new Error(e);
        });
        return reply;
    }

    updateBackend(backend) {
        if (backend) {
            this.backend = backend;
            this.axiosInst = axios.create({
                baseURL: this.backend,
            });
        }
    }

    buildSession() {
        const digits = () => String(Math.random()).slice(2);
        return `${digits()}--${digits()}`;
    }
}