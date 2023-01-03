# Closest-Points

**Número da Lista**: 17

**Conteúdo da Disciplina**: D&C

## Alunos

|Matrícula | Aluno |
| -- | -- |
| 20/0019015 | Guilherme Puida Moreira |
| 19/0118288 | Vitor Eduardo Kühl Rodrigues |

## Sobre 

O projeto tem como objetivo visualizar o algoritmo de pontos mais próximos usando a técnica de dividir e conquistar.

Para isso, as etapas são executadas sequencialmente, mostrando os passos do algoritmo.

Ao finalizar a execução, os pontos mais próximos são destacados, e a distância entre eles fica registrada no campo _Distância_.


## Screenshots

![Alt Text](/media/capture1.png)
![Alt Text](/media/capture2.png)
![Alt Text](/media/capture3.png)

## Vídeo

[O vídeo pode ser encontrado aqui.](/media/dc.mp4)

## Instalação 

O projeto depende de `node` >= 16 e `yarn`.

**Linguagem**: Typescript 

Para rodar o projeto, clone o repositório:

```bash
git clone https://github.com/projeto-de-algoritmos/DC_Closest-Points
cd DC_Closest-Points
```

Instale as dependências e rode o servidor local:

```bash
yarn
yarn dev
```

O projeto estará disponível em `localhost:5173`.

O projeto também está hospedado em https://closest.puida.xyz

Para rodar os testes (com coverage), execute `yarn coverage`. O relatório fica disponível em `coverage/index.html`.

## Uso 

Clique em qualquer espaço na área delimitada com uma borda preta para adicionar um ponto.
Quanto existem mais de três pontos, a solução pode ser encontrada usando o botão `Encontrar menor distância`.
Para limpar a tentativa atual e os pontos inseridos, use o botão `Limpar`.

Para auxiliar nos testes, o botão `Gerar aleatório` insere pontos aleatórios de acordo com a quantidade inserida no slider ao lado.

A menor distância fica no campo `Menor distância`, e o evento atual no campo `Evento`.

Para controlar a velocidade da animação, use o slider `Velocidade`.

## Outros 

O projeto não usa nenhuma dependência além do `Vite`, que é usado para o servidor de desenvolvimento e bundle de arquivos, e `Vitest / C8`, que são usados para executar os testes e gerar o relatório de coverage.



