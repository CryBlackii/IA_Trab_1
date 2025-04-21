"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getVizinho;
function getVizinho(node, mapa) {
    const vizinhos = [];
    const direcoes = [
        { dx: -1, dy: 0 }, // Cima
        { dx: 1, dy: 0 }, // Baixo
        { dx: 0, dy: -1 }, // Esquerda
        { dx: 0, dy: 1 }, // Direita
    ];
    for (const { dx, dy } of direcoes) {
        const novoX = node.x + dx;
        const novoY = node.y + dy;
        if (novoX >= 0 &&
            novoX < mapa.length &&
            novoY >= 0 &&
            novoY < mapa[0].length &&
            mapa[novoX][novoY] === 0 // Verifica se a célula é acessível
        ) {
            vizinhos.push({ x: novoX, y: novoY, g: 0, h: 0, f: 0, parent: null });
        }
    }
    return vizinhos;
}
