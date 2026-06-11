//#region src/internal/clerk-js/injectedWeb3EthProviders.ts
var InjectedWeb3EthProviders = class InjectedWeb3EthProviders {
	#providers = [];
	#providerIdMap = {
		metamask: "MetaMask",
		okx_wallet: "OKX Wallet"
	};
	static #instance = null;
	constructor() {
		if (typeof window === "undefined") return;
		window.addEventListener("eip6963:announceProvider", this.#onAnnouncement);
		window.dispatchEvent(new Event("eip6963:requestProvider"));
	}
	static getInstance() {
		if (!InjectedWeb3EthProviders.#instance) InjectedWeb3EthProviders.#instance = new InjectedWeb3EthProviders();
		return InjectedWeb3EthProviders.#instance;
	}
	get = (provider) => {
		const ethProvider = this.#providers.find((p) => p.info.name === this.#providerIdMap[provider])?.provider;
		if (ethProvider !== void 0) return ethProvider;
		return window.ethereum;
	};
	#onAnnouncement = (event) => {
		if (this.#providers.some((p) => p.info.uuid === event.detail.info.uuid)) return;
		this.#providers.push(event.detail);
	};
};
const getInjectedWeb3EthProviders = () => InjectedWeb3EthProviders.getInstance();

//#endregion
export { getInjectedWeb3EthProviders as t };
//# sourceMappingURL=injectedWeb3EthProviders-Cp_aXKsI.mjs.map