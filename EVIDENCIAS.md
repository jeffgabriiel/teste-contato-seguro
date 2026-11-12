# Evidências

Validação manual no front (`client/`), em https://localhost:5100.

Escopo: épicos Pessoa e Envolvimento do PRD.

## Épico 1: Pessoa

### Cenário 1 — Pessoa cadastrada aparece na listagem

1. **O que foi testado.** Cadastrar uma pessoa e consultá-la na listagem.
2. **Como foi testado.**
   - Abri Pessoas no menu (`/people`).
   - Cliquei em Cadastrar.
   - Preenchi nome, CPF, e-mail e data de nascimento.
   - Confirmei o cadastro.
3. **Resultado esperado.** A pessoa passa a aparecer na tabela, com nome, CPF, e-mail e data de nascimento.
4. **Resultado obtido.** A pessoa apareceu na listagem logo após o cadastro.

### Cenário 2 — CPF único

1. **O que foi testado.** Impedir um segundo cadastro com o mesmo CPF.
2. **Como foi testado.**
   - Com a pessoa do cenário 1 já listada, cliquei em Cadastrar de novo.
   - Informei outro nome e o mesmo CPF.
   - Confirmei.
3. **Resultado esperado.** O sistema recusa o CPF repetido e a listagem continua com um único registro desse CPF.
4. **Resultado obtido.** Apareceu a mensagem "Este CPF já está cadastrado." e a pessoa não foi duplicada na tabela.

## Épico 2: Envolvimento

### Cenário 3 — Vincular pessoa a um relato

1. **O que foi testado.** Vincular uma pessoa a um relato com um tipo de envolvimento e verificar o vínculo.
2. **Como foi testado.**
   - Abri Relatos no menu (`/records`).
   - Cliquei em Envolvidos no relato "Acesso não autorizado a sistema interno".
   - Selecionei a pessoa "Bruno Costa" e o tipo "Testemunha".
   - Cliquei em Adicionar.
3. **Resultado esperado.** O vínculo aparece na listagem do modal, com nome, CPF e tipo.
4. **Resultado obtido.** Bruno Costa apareceu na tabela como Testemunha, com CPF 987.654.321-00.

### Cenário 4 — Relato sem relatante é anônimo

1. **O que foi testado.** Verificar se um relato sem envolvido do tipo relatante é identificado como anônimo.
2. **Como foi testado.**
   - No mesmo relato do cenário 3, sem nenhum vínculo do tipo Relatante, abri o modal de Envolvidos.
   - Observei a tag ao lado do título do relato.
   - Após adicionar apenas uma testemunha, conferi a tag novamente.
3. **Resultado esperado.** A tag mostra "Anônimo" enquanto não houver relatante.
4. **Resultado obtido.** A tag permaneceu "Anônimo" antes e depois de vincular a testemunha. Em contraste, o relato "Descumprimento de política de privacidade de dados", que tem relatante, mostrou a tag "Identificado".

### Cenário 5 — Pessoa repetida no mesmo relato

1. **O que foi testado.** Impedir vincular a mesma pessoa duas vezes no mesmo relato (vínculo inválido).
2. **Como foi testado.**
   - Ainda no modal do cenário 3, com Bruno Costa já vinculado.
   - Selecionei novamente "Bruno Costa" e o tipo "Vítima".
   - Cliquei em Adicionar.
3. **Resultado esperado.** O sistema recusa o vínculo duplicado e a pessoa continua uma única vez na lista.
4. **Resultado obtido.** Apareceu a mensagem "Esta pessoa já está vinculada a este relato." e o segundo vínculo não foi criado.
