// src/services/blockchainService.js
import {blockchainApi} from "../api/auth";

export const blockchainService = {
    getBookCount: async () => {
        const response = await blockchainApi.getAmount();
        console.log(response);
        return await response.data;
    },

    getBook: async (id) => {
        const response = await blockchainApi.getBook(id);
        return await response.data;
    }
};
