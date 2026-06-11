//#region src/internal/clerk-js/user.ts
const getFullName = ({ firstName, lastName, name }) => name || [firstName, lastName].join(" ").trim() || "";
const getInitials = ({ firstName, lastName, name }) => [(firstName || "")[0], (lastName || "")[0]].join("").trim() || (name || "")[0];
const getIdentifier = (user) => {
	if (user.username) return user.username;
	if (user.primaryEmailAddress) return user.primaryEmailAddress.emailAddress;
	if (user.primaryPhoneNumber) return user.primaryPhoneNumber.phoneNumber;
	if (user.primaryWeb3Wallet) return user.primaryWeb3Wallet.web3Wallet;
	return "";
};

//#endregion
export { getFullName, getIdentifier, getInitials };
//# sourceMappingURL=user.mjs.map