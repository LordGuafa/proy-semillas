import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        name: "",

        token:null as string | null,
    }),
    actions: {
        login(name: string, email: string) {
            this.name = name;
            this.token ='' ;
        },
        logout() {
            this.token = null;
        }
    }
});