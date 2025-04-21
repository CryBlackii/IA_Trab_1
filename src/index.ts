import getVizinho from "./vizinho";
import mapa from './mapa';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function DistanciaEuclidiana(a: CurrentNode, b: CurrentNode): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export interface CurrentNode {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent: CurrentNode | null;
}

function AStar(start: CurrentNode, chegada: CurrentNode, mapa: number[][]): CurrentNode[] {
    const abertos: CurrentNode[] = [];
    const fechados: Set<string> = new Set();
    const pontG: Map<string, number> = new Map();
    const pontf: Map<string, number> = new Map();
    const parents: Map<string, CurrentNode | null> = new Map();
    const chave = (x: number, y: number): string => `${x},${y}`;

    pontG.set(chave(start.x, start.y), 0);
    pontf.set(chave(start.x, start.y), DistanciaEuclidiana(start, chegada));
    parents.set(chave(start.x, start.y), null);
    abertos.push({ ...start, g: 0, h: DistanciaEuclidiana(start, chegada), f: 0 });

    while (abertos.length > 0) {
        abertos.sort((a, b) => a.f - b.f);
        const atual = abertos.shift()!;
        if (atual.x === chegada.x && atual.y === chegada.y) {
            const caminho: CurrentNode[] = [];
            let chaveAtual = chave(atual.x, atual.y);
            let atualNode: CurrentNode | null = atual;
            while (atualNode) {
                caminho.push(atualNode);
                atualNode = parents.get(chaveAtual) ?? null;
                chaveAtual = atualNode ? chave(atualNode.x, atualNode.y) : "";
            }
            return caminho.reverse();
        }

        fechados.add(chave(atual.x, atual.y));

        for (const vizinho of getVizinho(atual, mapa)) {
            const chaveVizinho = chave(vizinho.x, vizinho.y);
            const gTemp = (pontG.get(chave(atual.x, atual.y)) ?? Infinity) + 1;

            if (fechados.has(chaveVizinho)) continue;

            if (!abertos.some(n => n.x === vizinho.x && n.y === vizinho.y) || gTemp < (pontG.get(chaveVizinho) ?? Infinity)) {
                pontG.set(chaveVizinho, gTemp);
                const h = DistanciaEuclidiana(vizinho, chegada);
                const f = gTemp + h;
                pontf.set(chaveVizinho, f);
                parents.set(chaveVizinho, atual);
                if (!abertos.some(n => n.x === vizinho.x && n.y === vizinho.y)) {
                    abertos.push({ ...vizinho, g: gTemp, h, f, parent: atual });
                }
            }
        }
    }

    return [];
}

async function animarCaminho(caminho: CurrentNode[], mapa: number[][], chegada: CurrentNode) {
    console.clear(); // Limpa antes de começar a animação
    for (let i = 0; i < caminho.length; i++) {
        const { x, y } = caminho[i];

        let tela = `Procurando melhor caminho\n\n`;

        for (let i = 0; i < mapa.length; i++) {
            let linha = "";
            for (let j = 0; j < mapa[i].length; j++) {
                if (i === chegada.x && j === chegada.y) {
                    linha += "🌸";
                } else if (i === x && j === y) {
                    linha += "🤖";
                } else {
                    linha += mapa[i][j] === 1 ? "🗑️" : "🍃";
                }
            }
            tela += linha + "\n";
        }

        console.log(tela);
        await sleep(150); // Mais suave
        process.stdout.write("\x1B[0f"); // Move o cursor pro topo sem limpar tudo
    }

    console.log("\n✅ Robô chegou na flor!");
}

async function main() {
    const start: CurrentNode = { x: 0, y: 0, g: 0, h: 0, f: 0, parent: null };
    const chegada: CurrentNode = { x: mapa.length - 1, y: mapa[0].length - 1, g: 0, h: 0, f: 0, parent: null };

    const caminho = AStar(start, chegada, mapa);

    if (caminho.length === 0) {
        console.log("🚫 Caminho não encontrado.");
    } else {
        await animarCaminho(caminho, mapa, chegada);
    }
}

main();