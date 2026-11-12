# Evidências

Validação manual no front (`client/`), em https://localhost:5100/people.

Escopo desta rodada: épico Pessoa do PRD. Envolvimento nos relatos fica para a próxima.

## Cenário 1 — Pessoa cadastrada aparece na listagem

1. **O que foi testado.** Cadastrar uma pessoa e consultá-la na listagem.
2. **Como foi testado.**
   - Abri Pessoas no menu.
   - Cliquei em Cadastrar.
   - Preenchi nome, CPF, e-mail e data de nascimento.
   - Confirmei o cadastro.
3. **Resultado esperado.** A pessoa passa a aparecer na tabela, com nome, CPF, e-mail e data de nascimento.
4. **Resultado obtido.** A pessoa apareceu na listagem logo após o cadastro.

## Cenário 2 — CPF único

1. **O que foi testado.** Impedir um segundo cadastro com o mesmo CPF.
2. **Como foi testado.**
   - Com a pessoa do cenário 1 já listada, cliquei em Cadastrar de novo.
   - Informei outro nome e o mesmo CPF.
   - Confirmei.
3. **Resultado esperado.** O sistema recusa o CPF repetido e a listagem continua com um único registro desse CPF.
4. **Resultado obtido.** Apareceu a mensagem "Este CPF já está cadastrado." e a pessoa não foi duplicada na tabela.
