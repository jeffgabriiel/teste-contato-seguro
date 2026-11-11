# Design Plan

## O que eu entendi

O sistema já tem empresas e relatos. Falta cadastrar **pessoas** e ligar essas pessoas aos relatos com um tipo de envolvimento (relatante, testemunha, vítima, denunciado).

Sem relatante, o relato é anônimo. Isso vem da API (`is_anonymous`), não é regra inventada no front.

Vou mexer só no `client/`. Backend não mexe.

## O que vou construir

### 1. Pessoas
- Página nova no menu (`/people`)
- CRUD igual o de Empresas: listar, cadastrar, editar, excluir
- Campos: nome, CPF, e-mail, data de nascimento
- CPF único → tratar erro 409

### 2. Envolvidos nos Relatos
- Botão "Envolvidos" na linha do relato
- Modal separado (não misturar com editar relato)
- Lista de vínculos + adicionar/remover
- Tag Anônimo / Identificado no modal

## Como vou organizar o código

Vou copiar o padrão de `company` e `record`:

- `domain/person/` → types, api, context, components, page
- `domain/involvement/` → types, api, modal
- rota e menu em `router.tsx` e `MainLayout.tsx`

## Ordem

1. Pessoa (CRUD completo)
2. Envolvimento (modal nos relatos)
3. Testar os cenários do PRD e anotar em `EVIDENCIAS.md`

## Riscos

- Quebrar o padrão do projeto → seguir company/record
- CPF ou vínculo duplicado → mostrar o 409 direito
- Não sair carregando envolvimento de todos os relatos de uma vez → só no modal
