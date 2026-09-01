//#region src/hooks.server.ts
var handleError = async ({ error, event, status, message }) => {
	if (status == 404) return;
	console.error(`An error was captured:`);
	console.error(error);
	console.error(`Event:`, event);
	console.error(`Status:`, status);
	console.error(`Message:`, message);
};
//#endregion
export { handleError };

//# sourceMappingURL=hooks.server.js.map