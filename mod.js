

export function iframeBridgePlugin() {
	const plugin = /** @type {const} @satisfies {import("$adlad").AdLadPlugin} */ ({
		name: "iframe-bridge",
		manualNeedsMute: true,
		manualNeedsPause: true,
		initialize(ctx) {
			if (window.parent == window) {
				throw new Error("This plugin only works when embedded inside an iframe that is hosted on a page built by adlad-iframe-builder.");
			}

		}
	});

	return plugin;
}
