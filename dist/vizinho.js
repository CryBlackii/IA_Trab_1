"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getVizinho;
// Função que retorna os vizinhos acessíveis (cima, baixo, esquerda, direita) de um nó atual no mapa
function getVizinho(node, mapa) {
    // Array para armazenar os vizinhos válidos encontrados
    const vizinhos = [];
    // Direções possíveis para se mover (cima, baixo, esquerda, direita)
    const direcoes = [
        { dx: -1, dy: 0 }, // Cima
        { dx: 1, dy: 0 }, // Baixo
        { dx: 0, dy: -1 }, // Esquerda
        { dx: 0, dy: 1 }, // Direita
    ];
    for (const { dx, dy } of direcoes) { // Calcula a nova posição baseada na direção
        const novoX = node.x + dx;
        const novoY = node.y + dy;
        // Verifica se a nova posição está dentro dos limites do mapa, e se a célula é acessível (valor 0 no mapa)
        if (novoX >= 0 &&
            novoX < mapa.length &&
            novoY >= 0 &&
            novoY < mapa[0].length &&
            mapa[novoX][novoY] === 0 // 0 indica que a célula é livre
        ) {
            // Adiciona o vizinho acessível à lista
            vizinhos.push({ x: novoX, y: novoY, g: 0, h: 0, f: 0, parent: null });
        }
    }
    return vizinhos;
}
