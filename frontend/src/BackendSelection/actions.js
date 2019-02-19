import { API } from "../middleware/api";

export const BackendSelection = {
    getAddress: async () => {
        API.setBackendURL('');
        return '';
    }
}