
//#region src/internal/clerk-js/injectedWeb3SolanaProviders.ts
var InjectedWeb3SolanaProviders = class InjectedWeb3SolanaProviders {
	#wallets = void 0;
	#initialized = false;
	static #instance = null;
	constructor() {}
	async #initialize() {
		if (this.#initialized) return;
		this.#initialized = true;
		const wallets = await Promise.resolve().then(() => require("./esm-D9kK-xzr.js")).then((mod) => mod.getWallets());
		this.#wallets = wallets.get();
		wallets.on("register", () => {
			this.#wallets = wallets.get();
		});
		wallets.on("unregister", () => {
			this.#wallets = wallets.get();
		});
	}
	#isSolanaWallet(wallet) {
		return wallet.chains?.some((chain) => chain.startsWith("solana:")) ?? false;
	}
	#hasSignMessage(wallet) {
		return "solana:signMessage" in wallet.features;
	}
	static getInstance() {
		if (!InjectedWeb3SolanaProviders.#instance) InjectedWeb3SolanaProviders.#instance = new InjectedWeb3SolanaProviders();
		return InjectedWeb3SolanaProviders.#instance;
	}
	get = async (walletName) => {
		await this.#initialize();
		const wallet = (this.#wallets || []).find((w) => w.name === walletName && this.#isSolanaWallet(w) && this.#hasSignMessage(w));
		if (wallet && this.#isSolanaWallet(wallet)) return wallet;
		if (typeof window === "undefined") return;
		const fallbackProvider = window.solana;
		if (fallbackProvider && typeof fallbackProvider.connect === "function" && typeof fallbackProvider.signMessage === "function") return fallbackProvider;
	};
};
const getInjectedWeb3SolanaProviders = () => InjectedWeb3SolanaProviders.getInstance();

//#endregion
Object.defineProperty(exports, 'getInjectedWeb3SolanaProviders', {
  enumerable: true,
  get: function () {
    return getInjectedWeb3SolanaProviders;
  }
});
//# sourceMappingURL=injectedWeb3SolanaProviders-Cbd4CVu9.js.map