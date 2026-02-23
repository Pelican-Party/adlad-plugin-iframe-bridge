import { TypedMessenger } from "../deps/vendor/raw.githubusercontent.com/rendajs/Renda/2e6b39958c7db0e2b9eefb861fbc7ede23104bce/src/util/TypedMessenger/TypedMessenger.js";
import { TimeoutError } from "../deps/vendor/raw.githubusercontent.com/rendajs/Renda/2e6b39958c7db0e2b9eefb861fbc7ede23104bce/src/util/TimeoutError.js";

export function iframeBridgePlugin() {
	const messenger = new TypedMessenger();

	const plugin = /** @type {const} @satisfies {import("$adlad").AdLadPlugin} */ ({
		name: "iframe-bridge",
		manualNeedsMute: true,
		manualNeedsPause: true,
		async initialize(ctx) {
			if (window.parent == window) {
				throw new Error(
					"This plugin only works when embedded inside an iframe that is hosted on a page built by adlad-iframe-builder.",
				);
			}

			messenger.setSendHandler((data) => {
				window.parent.postMessage({ adLadIframeBridgeMessage: data.sendData }, "*", data.transfer);
			});
			globalThis.addEventListener("message", (event) => {
				if (typeof event.data == "object" && event.data && "adLadIframeBridgeMessage" in event.data) {
					messenger.handleReceivedMessage(event.data.adLadIframeBridgeMessage);
				}
			});
			messenger.setResponseHandlers({
				/**
				 * @param {boolean} needsMute
				 */
				setNeedsMute: (needsMute) => {
					ctx.setNeedsMute(needsMute);
				},
				/**
				 * @param {boolean} needsPause
				 */
				setNeedsPause: (needsPause) => {
					ctx.setNeedsPause(needsPause);
				},
			});

			let initResult;
			try {
				initResult = await messenger.sendWithOptions.init({
					timeout: 10_000,
				});
			} catch (error) {
				if (error instanceof TimeoutError) {
					throw new Error(
						"Parent window didn't respond in time during initialization. Make sure this page is embedded inside an iframe that is hosted on a page built by adlad-iframe-builder.",
					);
				} else {
					throw error;
				}
			}
			if (!initResult) {
				throw new Error("Parent window responded with an unknown response during initialization");
			}
			if (!initResult.success) {
				throw new Error("Parrent window responded with an error");
			}
		},
		async showFullScreenAd() {
			return await messenger.send.showFullScreenAd();
		},
	});

	return plugin;
}
