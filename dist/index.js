"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vizinho_1 = __importDefault(require("./vizinho"));
const mapa_1 = __importDefault(require("./mapa"));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function DistanciaEuclidiana(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
function AStar(start, chegada, mapa) {
    var _a, _b, _c;
    const abertos = [];
    const fechados = new Set();
    const pontG = new Map();
    const pontf = new Map();
    const parents = new Map();
    const chave = (x, y) => `${x},${y}`;
    pontG.set(chave(start.x, start.y), 0);
    pontf.set(chave(start.x, start.y), DistanciaEuclidiana(start, chegada));
    parents.set(chave(start.x, start.y), null);
    abertos.push(Object.assign(Object.assign({}, start), { g: 0, h: DistanciaEuclidiana(start, chegada), f: 0 }));
    while (abertos.length > 0) {
        abertos.sort((a, b) => a.f - b.f);
        const atual = abertos.shift();
        if (atual.x === chegada.x && atual.y === chegada.y) {
            const caminho = [];
            let chaveAtual = chave(atual.x, atual.y);
            let atualNode = atual;
            while (atualNode) {
                caminho.push(atualNode);
                atualNode = (_a = parents.get(chaveAtual)) !== null && _a !== void 0 ? _a : null;
                chaveAtual = atualNode ? chave(atualNode.x, atualNode.y) : "";
            }
            return caminho.reverse();
        }
        fechados.add(chave(atual.x, atual.y));
        for (const vizinho of (0, vizinho_1.default)(atual, mapa)) {
            const chaveVizinho = chave(vizinho.x, vizinho.y);
            const gTemp = ((_b = pontG.get(chave(atual.x, atual.y))) !== null && _b !== void 0 ? _b : Infinity) + 1;
            if (fechados.has(chaveVizinho))
                continue;
            if (!abertos.some(n => n.x === vizinho.x && n.y === vizinho.y) || gTemp < ((_c = pontG.get(chaveVizinho)) !== null && _c !== void 0 ? _c : Infinity)) {
                pontG.set(chaveVizinho, gTemp);
                const h = DistanciaEuclidiana(vizinho, chegada);
                const f = gTemp + h;
                pontf.set(chaveVizinho, f);
                parents.set(chaveVizinho, atual);
                if (!abertos.some(n => n.x === vizinho.x && n.y === vizinho.y)) {
                    abertos.push(Object.assign(Object.assign({}, vizinho), { g: gTemp, h, f, parent: atual }));
                }
            }
        }
    }
    return [];
}
function printarMapa(mapa, robo, chegada) {
    let tela = `Wall-e está correndo tentando evitar os lixos 😱\n\n`;
    for (let i = 0; i < mapa.length; i++) {
        let linha = "";
        for (let j = 0; j < mapa[i].length; j++) {
            if (i === chegada.x && j === chegada.y) {
                linha += "🌱";
            }
            else if (i === robo.x && j === robo.y) {
                linha += "🤖";
            }
            else {
                linha += mapa[i][j] === 1 ? "🗑️" : "🟫";
            }
        }
        tela += linha + "\n";
    }
    console.log(tela);
}
function animarCaminho(caminho, mapa, chegada) {
    return __awaiter(this, void 0, void 0, function* () {
        console.clear();
        for (let i = 0; i < caminho.length; i++) {
            const { x, y } = caminho[i];
            printarMapa(mapa, { x, y }, chegada);
            yield sleep(150);
            process.stdout.write("\x1B[0f");
        }
        console.clear();
        printarMapa(mapa, chegada, chegada);
        console.log("Wall-e chegou na plantinha, ebaaa");
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const start = { x: 0, y: 0, g: 0, h: 0, f: 0, parent: null };
        const chegada = { x: mapa_1.default.length - 1, y: mapa_1.default[0].length - 1, g: 0, h: 0, f: 0, parent: null };
        const caminho = AStar(start, chegada, mapa_1.default);
        if (caminho.length === 0) {
            console.log("🚫 Caminho não encontrado.");
        }
        else {
            yield animarCaminho(caminho, mapa_1.default, chegada);
        }
    });
}
main();
