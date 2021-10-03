/**
 * @name TokenLogin
 * @author Erdi
 * @description Login using a token
 * @version 1.0.0
 */
 module.exports = class TokenLogin {
    start() {
        if (!global.ZeresPluginLibrary) return BdApi.showConfirmationModal(
            "Library Missing",
            [
                "The library plugin needed for TokenLogin is missing.",
                "Click \"Okay\" to install it!"
            ],
            {
                danger: true,
                cancelText: "Go Back",
                confirmText: "Okay",
                onConfirm: () => {
                    require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                        if (!e && b && r.statusCode == 200) {
                            require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
                            BdApi.Plugins.disable("TokenLogin");
                            setTimeout(() => BdApi.Plugins.enable("TokenLogin"), 5000);
                        }
                        else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
                    });
                }
            }
        );
        
        const { WebpackModules } = ZLibrary;
        const AccountManager = WebpackModules.getByProps("loginToken");

        this.keydownListener = event => {
            if(!(event.altKey && event.key.toLowerCase() === "l")) return;

            const className = "token-" + uuid();

            const input = BdApi.React.createElement(
                "input",
                {
                    style: {
                        color: "white",
                        background: "black",
                        minWidth: "100%",
                        minHeight: "2rem"
                    },
                    className
                }
            );
            
            BdApi.showConfirmationModal(
                "Insert a token",
                [
                    input
                ],
                {
                    danger: false,
                    confirmText: "Submit",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        const token = document.getElementsByClassName(className)[0].value;
                        if(!token) return BdApi.showConfirmationModal("Error!", ["No token inserted!"], {danger: true, cancelText: null, confirmText: "Okay"});

                        AccountManager.loginToken(token);
                    }
                }
            );
        };

        document.addEventListener("keydown", this.keydownListener);
    }

    stop() {
        if(this.keydownListener) document.removeEventListener("keydown", this.keydownListener);
    }
};

function uuid() {
    const template = "xxxxxxxx";
    let uuid = "";
    for(let i = 0; i < template.length; i++) {
        uuid += Math.floor(Math.random() * 9);
    }
    return uuid;
}
