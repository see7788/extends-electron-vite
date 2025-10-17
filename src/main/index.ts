import Base, { appinit } from "lib-vanilla/electronBase/main"
appinit().then(() => new Base({ broId: "index" })).then(v => v.broObj.loadURL("https://www.tongyi.com/"))