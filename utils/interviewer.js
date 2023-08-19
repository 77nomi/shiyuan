module.exports = {
    dealDep: dealDep, 
    dealDepOfQueue: dealDepOfQueue
}

function dealDep(dep){
        if (dep === "BGS") {
            dep = "办公室"
        };
      if (dep === "CWB") {
            dep = "财务部"
        };
        if (dep === "XWB") {
            dep = "新闻部"
        };
        if (dep === "YYB") {
            dep = "运营部"
        };
        if (dep === "XCB") {
            dep = "宣传部"
        };
        if (dep === "CHB") {
            dep = "策划部"
        };
        if (dep === "JSB") {
            dep = "竞赛部"
        };
        if (dep === "ZKB") {
            dep = "自科部"
        };
        if (dep === "SKB") {
            dep = "社科部"
        }
        if (dep === "XMB") {
            dep = "项目部"
        };
        if (dep === "WLB") {
            dep = "外联部"
        };
    return dep;
}

function dealDepOfQueue(dep) {
    if (dep === "XCB") {
        return "宣传部"
    };
    if (dep === "ZKB") {
        return "自科部"
    };
    return "校科联";
}