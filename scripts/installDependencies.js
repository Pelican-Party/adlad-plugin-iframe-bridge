import { vendor } from "https://deno.land/x/dev@v0.4.0/mod.js";
import { setCwd } from "$chdir_anywhere";
setCwd();
Deno.chdir("..");

export async function installDependencies() {
	await vendor({
		entryPoints: [
			`https://raw.githubusercontent.com/rendajs/Renda/2e6b39958c7db0e2b9eefb861fbc7ede23104bce/src/util/TypedMessenger/TypedMessenger.js`,
		],
		outDir: "deps/vendor",
	});
}
