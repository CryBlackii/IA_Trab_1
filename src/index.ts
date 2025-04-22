import getVizinho from "./vizinho";
import mapa from './mapa';

function sleep(ms: number) {// Função auxiliar para pausar a execução por um certo tempo (em milissegundos)
    return new Promise(resolve => setTimeout(resolve, ms));
}

function DistanciaEuclidiana(a: CurrentNode, b: CurrentNode): number { // vai calcular a distancia de dois nós para ver o custo daquele caminho
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export interface CurrentNode {
    x: number;
    y: number;
    g: number; // custo do caminho desde o início até esse nó
    h: number; // heurística (distância estimada até o destino)
    f: number; // f = g + h
    parent: CurrentNode | null; // referência para o pai (para reconstruir o caminho)
}

// Função que implementa o algoritmo A* e retorna o caminho até o destino
function AStar(start: CurrentNode, chegada: CurrentNode, mapa: number[][]): CurrentNode[] {
    const abertos: CurrentNode[] = []; // lista de nós a serem explorados
    const fechados: Set<string> = new Set(); // conjunto de nós já explorados
    const pontG: Map<string, number> = new Map(); // custo g de cada nó
    const pontf: Map<string, number> = new Map(); // custo f de cada nó
    const parents: Map<string, CurrentNode | null> = new Map(); // referência para o pai de cada nó
    const chave = (x: number, y: number): string => `${x},${y}`; // converte coordenadas para string (chave)

    pontG.set(chave(start.x, start.y), 0);
    pontf.set(chave(start.x, start.y), DistanciaEuclidiana(start, chegada));
    parents.set(chave(start.x, start.y), null);
    abertos.push({ ...start, g: 0, h: DistanciaEuclidiana(start, chegada), f: 0 });

    // Loop principal do A*
    while (abertos.length > 0) {
        // Ordena os abertos pelo menor custo f
        abertos.sort((a, b) => a.f - b.f);
        const atual = abertos.shift()!; // pega o nó com menor f

        // Se chegamos ao destino, reconstruímos o caminho
        if (atual.x === chegada.x && atual.y === chegada.y) {
            const caminho: CurrentNode[] = [];
            let chaveAtual = chave(atual.x, atual.y);
            let atualNode: CurrentNode | null = atual;
            while (atualNode) {
                caminho.push(atualNode);
                atualNode = parents.get(chaveAtual) ?? null;
                chaveAtual = atualNode ? chave(atualNode.x, atualNode.y) : "";
            }
            return caminho.reverse(); // retorna o caminho do início até o fim
        }

        // Marca o nó como explorado
        fechados.add(chave(atual.x, atual.y));

        // Explora os vizinhos acessíveis
        for (const vizinho of getVizinho(atual, mapa)) {
            const chaveVizinho = chave(vizinho.x, vizinho.y);
            const gTemp = (pontG.get(chave(atual.x, atual.y)) ?? Infinity) + 1;

            if (fechados.has(chaveVizinho)) continue; // ignora se já explorado

            // Se ainda não está nos abertos ou encontrou um caminho melhor:
            if (!abertos.some(n => n.x === vizinho.x && n.y === vizinho.y) || gTemp < (pontG.get(chaveVizinho) ?? Infinity)) {
                pontG.set(chaveVizinho, gTemp);
                const h = DistanciaEuclidiana(vizinho, chegada);
                const f = gTemp + h;
                pontf.set(chaveVizinho, f);
                parents.set(chaveVizinho, atual);

                // Adiciona o vizinho à lista de abertos se ainda não estiver lá
                if (!abertos.some(n => n.x === vizinho.x && n.y === vizinho.y)) {
                    abertos.push({ ...vizinho, g: gTemp, h, f, parent: atual });
                }
            }
        }
    }

    // Se não encontrou caminho
    return [];
}

// Função para imprimir o mapa no terminal com emojis 🌱🤖🗑️
function printarMapa(mapa: number[][], robo: { x: number, y: number }, chegada: { x: number, y: number }) {
    let tela = `Wall-e está correndo tentando evitar os lixos 😱\n\n`;

    for (let i = 0; i < mapa.length; i++) {
        let linha = "";
        for (let j = 0; j < mapa[i].length; j++) {
            if (i === chegada.x && j === chegada.y) {
                linha += "🌱"; 
            } else if (i === robo.x && j === robo.y) {
                linha += "🤖";
            } else {
                linha += mapa[i][j] === 1 ? "🗑️ " : "🟫";
            }
        }
        tela += linha + "\n";
    }

    console.log(tela);
}

// Anima o caminho encontrado pelo algoritmo, passo a passo
async function animarCaminho(caminho: CurrentNode[], mapa: number[][], chegada: CurrentNode) {
    console.clear(); // limpa o terminal

    for (let i = 0; i < caminho.length; i++) {
        const { x, y } = caminho[i];

        printarMapa(mapa, { x, y }, chegada);
        await sleep(150); // pausa para animação
        process.stdout.write("\x1B[0f"); // procede para o próximo frame sem guardar o anterior
    }

    console.clear();
    printarMapa(mapa, chegada, chegada);
    console.log("Wall-e chegou na plantinha, ebaaa 🌱🎉");
}

async function main() {
    const start: CurrentNode = { x: 0, y: 0, g: 0, h: 0, f: 0, parent: null }; // ponto inicial
    const chegada: CurrentNode = { x: mapa.length - 1, y: mapa[0].length - 1, g: 0, h: 0, f: 0, parent: null }; // ponto final

    const caminho = AStar(start, chegada, mapa); // executa o A*

    if (caminho.length === 0) {
        console.log("🚫 Caminho não encontrado."); // se não encontrou rota
    } else {
        await animarCaminho(caminho, mapa, chegada); // anima se encontrou
    }
}

main();