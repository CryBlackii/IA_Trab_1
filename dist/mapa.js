"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function gerarMapaLabirinto(tamanho) {
    const mapa = Array.from({ length: tamanho }, () => Array(tamanho).fill(1)); // tudo como lixo 🗑️
    // cria linhas pares totalmente acessíveis
    for (let i = 0; i < tamanho; i++) {
        if (i % 2 === 0) {
            for (let j = 0; j < tamanho; j++) {
                mapa[i][j] = 0; // 🍃
            }
        }
        else {
            // linha ímpar: parede com algumas passagens aleatórias
            const aberturas = Math.floor(Math.random() * (tamanho / 2)) + 1; // ao menos uma
            for (let k = 0; k < aberturas; k++) {
                const j = Math.floor(Math.random() * tamanho);
                mapa[i][j] = 0;
            }
        }
    }
    mapa[0][0] = 0;
    mapa[tamanho - 1][tamanho - 1] = 0;
    return mapa;
}
const mapa = gerarMapaLabirinto(15);
exports.default = mapa;
