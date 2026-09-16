import { r as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CGdnV_aG.mjs";
import { u as createSsrRpc } from "./api-BmE3vsND.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integrations-api-BS8riFGh.js
var integrations_api_BS8riFGh_exports = /* @__PURE__ */ __exportAll({
	a: () => importCloudFile,
	c: () => lookupTsa,
	d: () => saveAiConnector,
	f: () => saveByok,
	g: () => testByok,
	h: () => testAiConnector,
	i: () => getTsaChain,
	l: () => pingWebhook,
	m: () => saveWebhook,
	n: () => emitTestEvent,
	o: () => integrations_api_exports,
	p: () => saveOneDriveToken,
	r: () => getIntegrations,
	s: () => listCloudFiles,
	t: () => createApiKey,
	u: () => revokeApiKey
});
var integrations_api_exports = /* @__PURE__ */ __exportAll$1({
	createApiKey: () => createApiKey,
	emitTestEvent: () => emitTestEvent,
	getIntegrations: () => getIntegrations,
	getTsaChain: () => getTsaChain,
	importCloudFile: () => importCloudFile,
	listCloudFiles: () => listCloudFiles,
	lookupTsa: () => lookupTsa,
	pingWebhook: () => pingWebhook,
	revokeApiKey: () => revokeApiKey,
	saveAiConnector: () => saveAiConnector,
	saveByok: () => saveByok,
	saveOneDriveToken: () => saveOneDriveToken,
	saveWebhook: () => saveWebhook,
	testAiConnector: () => testAiConnector,
	testByok: () => testByok
});
var getIntegrations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("44e996d159d36e38165f7790ef312bca2c1fe92a762bf77e3b46f98f11a7b221"));
var saveAiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("bfa8295f92a22390ee0118f52de3f24fb41eb3f114f84fe13a4a70a3d8c80144"));
var testAiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("7e16d315549dc0003a90cf3a2c585489fd7cf2cc237db50674323fa9f2d2639c"));
var saveByok = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("7f1606787e69b65c21733befcf01ddc551f21f55c5b0a992ae8d96ba42974b65"));
var testByok = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("3d9acf1f8044b1ade7ec7f6dbb658a7aa472b9a068fc6a350a16c2586b220c72"));
var saveOneDriveToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("191764417ef1e105e093d5180882cbf032bbfc7b6ac16663833eb9b06b7d1e97"));
var saveWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("9e9bf8cb30d8e1fa3151e3bddd0de28e281ccb27fba438779926fe897346b9a0"));
var pingWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("945cbc161475ef62df529ff54c2cad375f872eda865890bbd3e67c79de8d4e6f"));
var emitTestEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("03a984e9ee752757a8bb1d0617fb84d89c59392392e19c24387ddff4bccd0008"));
var createApiKey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("aba9b6034f0a693c10c8ed2b8e2acd0461555c811bc5526227b88cd95fdb80ee"));
var revokeApiKey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("915150cc1bcbe3ad90bbfd75fa7b8acb8b224c8a65bdbb25d8faa78f7a7c1675"));
var listCloudFiles = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("4e9302eafe4c4734915c459c5f43f8b8430c361878bce2a36005ddb06a9f9839"));
var importCloudFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createSsrRpc("51f98eb140177329d17f7006302002c3d75eb8f02c36e0ed4987bea8db4732bf"));
var getTsaChain = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(createSsrRpc("dcaa17b4ed10bfaa798d1ee0c369916a5be826b7a3199248c6db18842bb5e04b"));
var lookupTsa = createServerFn({ method: "GET" }).validator((serial) => serial).handler(createSsrRpc("3891e4780d51cbd9cecf64bad910a1eef0ae061192b85791a5b0d50478d765bc"));
//#endregion
export { importCloudFile as a, lookupTsa as c, saveAiConnector as d, saveByok as f, testByok as g, testAiConnector as h, getTsaChain as i, pingWebhook as l, saveWebhook as m, emitTestEvent as n, integrations_api_BS8riFGh_exports as o, saveOneDriveToken as p, getIntegrations as r, listCloudFiles as s, createApiKey as t, revokeApiKey as u };
