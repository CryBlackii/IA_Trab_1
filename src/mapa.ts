// Função que gera um mapa com vários caminhos possiveis até a plantinha
function gerarMapaLabirinto(tamanho: number): number[][] {
    // Cria uma matriz quadrada
    const mapa: number[][] = Array.from({ length: tamanho }, () => Array(tamanho).fill(1));

    // Percorre todas as linhas da matriz
    for (let i = 0; i < tamanho; i++) { // aqui basicamente faz a "aleatoriedade" do labirinto
        if (i % 2 === 0) { //se a linha for par deixa ela sem lixos
            for (let j = 0; j < tamanho; j++) {
                mapa[i][j] = 0;
            }
        } else { // se a linha for ímpar, cria alguns espaços sem lixos
            const aberturas = Math.floor(Math.random() * (tamanho / 2)) + 1;
            for (let k = 0; k < aberturas; k++) {
                const j = Math.floor(Math.random() * tamanho);
                mapa[i][j] = 0;
            }
        }
    }

    // Garante que a célula inicial [0][0] e final [tamanho-1][tamanho-1] sejam acessíveis
    mapa[0][0] = 0;
    mapa[tamanho - 1][tamanho - 1] = 0;
    return mapa;
}

const mapa = gerarMapaLabirinto(15);
export default mapa;