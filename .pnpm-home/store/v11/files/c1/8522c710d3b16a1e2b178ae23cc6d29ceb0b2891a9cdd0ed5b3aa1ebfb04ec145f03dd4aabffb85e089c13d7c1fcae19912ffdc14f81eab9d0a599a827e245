import { t as ClerkRuntimeError } from "../../clerkRuntimeError-DqAmLuLY.mjs";
import { y as buildErrorThrower } from "../../error-BwjsVTI1.mjs";
import "../../errors-oOcNTWU9.mjs";
import { t as toHex } from "../../hex-txii11Pj.mjs";
import { t as getInjectedWeb3EthProviders } from "../../injectedWeb3EthProviders-Cp_aXKsI.mjs";
import { t as getInjectedWeb3SolanaProviders } from "../../injectedWeb3SolanaProviders-DRQuwtHF.mjs";

//#region src/internal/clerk-js/web3.ts
const StandardConnect = `standard:connect`;
const SolanaSignMessage = `solana:signMessage`;
function createWeb3(moduleManager) {
	const errorThrower = buildErrorThrower({ packageName: "@clerk/shared" });
	async function getWeb3Identifier(params) {
		const { provider, walletName } = params;
		const walletProvider = await getWeb3Wallet(provider, walletName);
		if (!walletProvider) return "";
		if (provider === "solana") {
			const identifiers$1 = await walletProvider.features[StandardConnect].connect();
			return identifiers$1 && identifiers$1.accounts[0].address || "";
		}
		const identifiers = await walletProvider.request({ method: "eth_requestAccounts" });
		return identifiers && identifiers[0] || "";
	}
	const generateWeb3Signature = async (params) => {
		const { identifier, nonce, provider, walletName = "" } = params;
		const wallet = await getWeb3Wallet(provider, walletName);
		if (!wallet) return "";
		if (provider === "solana") try {
			const solanaWallet = wallet;
			const walletAccount = solanaWallet.accounts.find((a) => a.address === identifier);
			if (!walletAccount) {
				console.warn(`Wallet account with address ${identifier} not found`);
				return "";
			}
			const signedMessages = await solanaWallet.features[SolanaSignMessage]?.signMessage({
				account: walletAccount,
				message: new TextEncoder().encode(nonce)
			});
			return signedMessages?.[0]?.signature ? btoa(String.fromCharCode(...signedMessages[0].signature)) : "";
		} catch (err) {
			if (err instanceof Error && err.message.includes("User rejected the request.")) throw new ClerkRuntimeError("Web3 signature request was rejected by the user.", { code: "web3_signature_request_rejected" });
			throw new ClerkRuntimeError("An error occurred while generating the Solana signature.", {
				code: "web3_solana_signature_generation_failed",
				cause: err instanceof Error ? err : void 0
			});
		}
		return await wallet.request({
			method: "personal_sign",
			params: [`0x${toHex(nonce)}`, identifier]
		});
	};
	async function getMetamaskIdentifier() {
		return await getWeb3Identifier({ provider: "metamask" });
	}
	async function getCoinbaseWalletIdentifier() {
		return await getWeb3Identifier({ provider: "coinbase_wallet" });
	}
	async function getOKXWalletIdentifier() {
		return await getWeb3Identifier({ provider: "okx_wallet" });
	}
	async function getBaseIdentifier() {
		return await getWeb3Identifier({ provider: "base" });
	}
	async function getSolanaIdentifier(walletName) {
		return await getWeb3Identifier({
			provider: "solana",
			walletName
		});
	}
	async function generateSignatureWithMetamask(params) {
		return await generateWeb3Signature({
			...params,
			provider: "metamask"
		});
	}
	async function generateSignatureWithCoinbaseWallet(params) {
		return await generateWeb3Signature({
			...params,
			provider: "coinbase_wallet"
		});
	}
	async function generateSignatureWithOKXWallet(params) {
		return await generateWeb3Signature({
			...params,
			provider: "okx_wallet"
		});
	}
	async function generateSignatureWithBase(params) {
		return await generateWeb3Signature({
			...params,
			provider: "base"
		});
	}
	async function generateSignatureWithSolana(params) {
		return await generateWeb3Signature({
			...params,
			provider: "solana"
		});
	}
	async function getWeb3Wallet(provider, walletName) {
		if (provider === "coinbase_wallet") {
			const coinbaseModule = await moduleManager.import("@coinbase/wallet-sdk");
			if (!coinbaseModule) return null;
			return coinbaseModule.createCoinbaseWalletSDK({
				appName: typeof window !== "undefined" && window.Clerk?.__internal_environment?.displayConfig?.applicationName || typeof document !== "undefined" && document.title || "Web3 Application",
				preference: { options: "all" }
			}).getProvider();
		}
		if (provider === "base") try {
			const baseModule = await moduleManager.import("@base-org/account");
			if (!baseModule) return null;
			return baseModule.createBaseAccountSDK({ appName: typeof window !== "undefined" && window.Clerk?.__internal_environment?.displayConfig?.applicationName || typeof document !== "undefined" && document.title || "Web3 Application" }).getProvider();
		} catch {
			return null;
		}
		if (provider === "solana") {
			if (!walletName || walletName.length === 0) {
				errorThrower.throw("Wallet name must be provided to get Solana wallet provider");
				return;
			}
			return await getInjectedWeb3SolanaProviders().get(walletName);
		}
		return getInjectedWeb3EthProviders().get(provider);
	}
	return {
		getWeb3Identifier,
		generateWeb3Signature,
		getMetamaskIdentifier,
		getCoinbaseWalletIdentifier,
		getOKXWalletIdentifier,
		getBaseIdentifier,
		getSolanaIdentifier,
		generateSignatureWithMetamask,
		generateSignatureWithCoinbaseWallet,
		generateSignatureWithOKXWallet,
		generateSignatureWithBase,
		generateSignatureWithSolana
	};
}

//#endregion
export { createWeb3 };
//# sourceMappingURL=web3.mjs.map