require('../../constants-WYhx_umW.js');
require('../../isomorphicAtob-Hkpnx2p8.js');
require('../../isomorphicBtoa-_pSA92Q9.js');
require('../../keys-nhSphkCl.js');
require('../../globs-D0Kpu4g1.js');
require('../../instance-C1LlVxIp.js');
require('../../url-sAcxbiir.js');
const require_logger = require('../../logger-BOte4sQb.js');
require('../../netlifyCacheHandler-tf-8MGH1.js');
require('../../underscore-BX6Ucmg5.js');
require('../../constants-BUzkV8jh.js');
const require_queryParams = require('../../queryParams-BIKo3ou8.js');
require('../../path-ci3QmWY8.js');
require('../../querystring-BFj_iDi0.js');
const require_url$1 = require('../../url-PlwHs7Rp.js');

//#region src/internal/clerk-js/sessionTasks.ts
/**
* @internal
*/
const INTERNAL_SESSION_TASK_ROUTE_BY_KEY = {
	"choose-organization": "choose-organization",
	"reset-password": "reset-password",
	"setup-mfa": "setup-mfa"
};
/**
* @internal
*/
const getTaskEndpoint = (task) => `/tasks/${INTERNAL_SESSION_TASK_ROUTE_BY_KEY[task.key]}`;
/**
* @internal
*/
function buildTaskUrl(task, opts) {
	const params = require_queryParams.forwardClerkQueryParams();
	return require_url$1.buildURL({
		base: opts.base,
		hashPath: getTaskEndpoint(task),
		searchParams: params
	}, { stringify: true });
}
/**
* @internal
*/
function navigateIfTaskExists(session, { navigate, baseUrl }) {
	const currentTask = session.currentTask;
	if (!currentTask) return;
	return navigate(buildTaskUrl(currentTask, { base: baseUrl }));
}
function warnMissingPendingTaskHandlers(options) {
	const taskOptions = ["taskUrls", "navigate"];
	if (Object.keys(options).some((option) => taskOptions.includes(option))) return;
	require_logger.logger.warnOnce(`Clerk: Session has pending tasks but no handling is configured. To handle pending tasks, provide either "taskUrls" for navigation to custom URLs or "navigate" for programmatic navigation. Without these options, users may get stuck on incomplete flows.`);
}

//#endregion
exports.INTERNAL_SESSION_TASK_ROUTE_BY_KEY = INTERNAL_SESSION_TASK_ROUTE_BY_KEY;
exports.buildTaskUrl = buildTaskUrl;
exports.getTaskEndpoint = getTaskEndpoint;
exports.navigateIfTaskExists = navigateIfTaskExists;
exports.warnMissingPendingTaskHandlers = warnMissingPendingTaskHandlers;
//# sourceMappingURL=sessionTasks.js.map