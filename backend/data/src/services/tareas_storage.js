const fs = require("fs/promises")
const path = require("path")

const filePath = path.join(_dirname, "..", "..", "data", "tareas.json")

async function readAll(){
    const raw = await fs.readFile(filePath, "utf-8");

    if(!raw.trim()) return [];
    return JSON.parse(raw);
}
    async function writeAll(tareas) {
        await fs.writeFile(filePath, JSON.stringify(tareas, null, 2), "utf-8");
    }



module.exports = { readAll, writeAll };