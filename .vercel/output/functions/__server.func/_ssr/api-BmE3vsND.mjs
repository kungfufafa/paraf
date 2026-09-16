import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CGdnV_aG.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, ln as any, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-BmE3vsND.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var bootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("23c857d0b3a5d111d150eb6d596a0e6cf56c91fc3c51de16a6c3a859705833de"));
var listDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("f2ea807b0d6fa9543f12c22aab3d29506407fe00b9f46d26a7c9c3d18b7ede66"));
var getDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("250022f1737a31309e29c74fe65eaf9a1c57bce6b8323f17a6e1a7fd94a19f3e"));
var getPublicDocument = createServerFn({ method: "GET" }).validator((token) => token).handler(createSsrRpc("d2e822568f4373ddd67819852b7a8214e849a218aa9a493f052c0567d6492661"));
object({
	title: string().min(1),
	docType: string(),
	compliance: _enum(["psre", "globalsign"]),
	groupName: string().optional(),
	folderId: string().nullable().optional(),
	content: any(),
	fields: any(),
	settings: any(),
	recipients: array(object({
		name: string(),
		email: string(),
		phone: string().optional(),
		role: string().optional(),
		action: string().optional(),
		orderIndex: number().optional(),
		companyName: string().optional(),
		id: string().optional()
	})),
	deadline: string().nullable().optional(),
	effectiveDate: string().nullable().optional(),
	expiresAt: string().nullable().optional(),
	send: boolean().optional()
});
var saveDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("08df971a4fcde61cf9d2aaf0ef20adee2dae3037b4c63828501d3167b5ea6786"));
var mutateDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("e2787a10ab6c1381fd719581bd0121346b5a4fcdb2f86a840e7d96f855c86e3b"));
var applySignature = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("dea35a69275acfe5dc91aa2189f5ed3c3a56592f4c1ca770fc44b1245d6604cf"));
var publicSign = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("1e998e3f90a4b823589f6086a31cb16b69d5337f5d106207265c77c4845fa93f"));
var listContacts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("71249bd984c8066c0b4c0d533d13c4f77707b4cb493d0aaabaa4865a0033cf0d"));
var saveContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("974c98e3ef1cb357ced0b5bae6134556cce39ae27e283b134d5a287dcc60279b"));
var listTemplates = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("a97ff5a16033c3c207074c846db648b6389e996819fdbcab77b00caebca0345a"));
var listStamps = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9c77ed3897b63ef01f58336ffb56e23c6f55955c0b4224636f0872844d0e4d92"));
var listSignatures = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c3f55571004f2f5fbcb3d63a6ddb1cb0adbd050287ec0fafe215f677f8e34e56"));
var saveSignature = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("4ae53b914f4e766f3a3d094b441d7847ab19024d36997590326a8c4fe9f0a17a"));
var listApprovals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("930f9d6d8b02e1fadbbc1aadbe15545071b1a2098a34c7805d877a6c8e2e8884"));
var decideApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("a74439b4ff07d72e9ccb618deac55ce0e21f0a575c958193c288157232c7fb6f"));
var listContracts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("964c2fdfa405b614c96210144dcc59109072888262ac62822eca28c1b229f03f"));
var workspaceExtras = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4f64367c956fb942cc8e1b8827d092f903c7c70adecdebfef5b605d031c86f48"));
var buyEmeterai = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((qty) => qty).handler(createSsrRpc("a046db6570141b8c7bcea2734c4cebb1a1fe9738bf649246d29b213d1b4bc3d6"));
var saveEmeteraiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5a3b01ba49a0cb046973ce7cdedd5d748a6d27547f36e455e885672668c203d6"));
var testEmeteraiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("8367feb5bf82db26d2058d24ec6e3e1caeecc0d3648c3474e5692f034323a35d"));
var issueEmeterai = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("cd47de9dafabdd17fae2f1e3954aa633026248d9405cc070058048e35e6f36b5"));
var lookupEmeterai = createServerFn({ method: "GET" }).validator((serial) => serial).handler(createSsrRpc("558d597563b2b4e2429d9eae6568cfc0375ae2d2529240b4b0b02540f70b3fcf"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("7b4b96dcf07083e0a3cf4aaf7a4c5b905296d591b658726cb94c7a7e54fd431c"));
var updateCompany = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("5effda6832b5b440a3b7e3b2442f8a4caac490985627d83a37ec3eb210429e1d"));
var bulkSignDocs = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("e3c2c609aa5632a685c22c64c33c734c8a928ce8f89680be2733c70061c07ecb"));
var createFolder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((name) => name).handler(createSsrRpc("cf6a4ad66b6f94d885329ba643b42b4fd4169a2659dcbf7fbca55e283736c637"));
var saveStamp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("4272da774111dccf67a8f317ff6ebbf3f2f551325ced537748ba4170810190e5"));
var saveTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("14117c49f6b7374c697e3ea796257ba72bc0a6ab0ddd3bed42e0d4bb77ccf76c"));
var saveApprovalTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("acd9a9293b4dbada0527978a255e39e3a518be88d4c536dea595a3acfa357bcc"));
var addProof = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("2a1e666ab8a0f42a82418e9639611b316df271df7322a99840b4abc278c2d9cf"));
var addRecipient = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("9149f1c113f82b020461355f65721c5482f75fc3cea38355871b2838b6d17984"));
var setPasscode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("554e2b28c8d981bcac5b2469d1db7cd93fae21de92cfb0db753f15c986596fa6"));
var requestApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("af1cdfb4ee5f644aa07736577d3c381686cfa65c50fb6de38c34b97618bf509c"));
var getInsights = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("dd2493e4da72e69a1700e1ad61ecaf1d883090c1cf63f84fd165b99e95879197"));
var analyzeDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("1b1b581d874393882e6aca8b05735bc5e432b05a871feccf8685aa6d68ed9886"));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("37e24e424b50c61a8099763c01ddce36cc987a75efca225ed025f71140e1bfdf"));
var savePrefs = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("c76ed95cfff67ba63281d75ed5f9ea629c19bebbf94dd9d629c8a415da3aa9d1"));
var inviteMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("fba24b5e3e64e1df34f42e9773030d4bdb753f66a46252043cb945f8b0bedb31"));
var assignEmeterai = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("6bc40a8036f097773f56a5c2a64ef0d2e42a4ef49b5ec823e4c74991135945cf"));
var exportWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("4c474f77a4bdbbb602db1bf9645aa69c88f5dd253a8e6407812a27728b98ca8d"));
var getDemoInvites = createServerFn({ method: "GET" }).handler(createSsrRpc("7c01ce39465e17182ea2384b9e0994eb544fc7869dbd141d3a4b52ee80c8d9bd"));
//#endregion
export { saveApprovalTemplate as A, updateCompany as B, listSignatures as C, mutateDocument as D, lookupEmeterai as E, saveSignature as F, workspaceExtras as H, saveStamp as I, saveTemplate as L, saveDocument as M, saveEmeteraiConnector as N, publicSign as O, savePrefs as P, setPasscode as R, listDocuments as S, listTemplates as T, updateProfile as V, inviteMember as _, assignEmeterai as a, listContacts as b, buyEmeterai as c, decideApproval as d, exportWorkspace as f, getPublicDocument as g, getInsights as h, applySignature as i, saveContact as j, requestApproval as k, createFolder as l, getDocument as m, addRecipient as n, bootstrap as o, getDemoInvites as p, analyzeDocument as r, bulkSignDocs as s, addProof as t, createSsrRpc as u, issueEmeterai as v, listStamps as w, listContracts as x, listApprovals as y, testEmeteraiConnector as z };
