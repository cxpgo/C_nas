/**
 * 这些类调用即将被遗弃
 */

Object.defineProperties(window, {
    /**
     * GAMENAMES[*] 取值 将替换为 PackageMgr.getGameName(*) || PackageMgr.AllGameNames[*]
     */
    "GAMENAMES": {
        get: function () {
            return PackageMgr.AllGameNames;
        },
    },
    /**
     * GAMETYPES[*] 取值 将替换为 PackageMgr.getGameAppID(*) || PackageMgr.AllGameIDs[*]
     */
    "GAMETYPES": {
        get: function () {
            return PackageMgr.AllGameIDs;
        },
    },
});
