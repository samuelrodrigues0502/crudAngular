# CRUD Angular (Local)

Aplicação web para gerenciamento de produtos com operações de cadastro, listagem, edição e exclusão.

<p align="left">
	<img alt="Angular" src="https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white" />
	<img alt="PrimeNG" src="https://img.shields.io/badge/PrimeNG-21-0A5CFF" />
	<img alt="Status" src="https://img.shields.io/badge/Status-Em%20desenvolvimento-2EA44F" />
</p>

## Sumário

- [Stack](#stack)
- [Funcionalidades](#funcionalidades)
- [Prints da aplicação](#prints-da-aplicação)
- [Como rodar](#como-rodar)
- [Testes](#testes)

## Stack

- Angular 21
- PrimeNG
- Reactive Forms
- Signals
- localStorage

## Funcionalidades

- Cadastro de produtos
- Listagem em tabela com paginação
- Edição de produto em modal
- Exclusão com confirmação
- Feedback visual com mensagens de sucesso/erro
- Persistência local dos dados

## Prints da aplicação

<table>
	<tr>
		<td colspan="2" align="center">
			<img src="docs/screenshots/print1.png" alt="Visão geral da aplicação com dashboard e tabela de produtos" />
		</td>
	</tr>
	<tr>
		<td align="center"><strong>Cadastro de produto</strong></td>
		<td align="center"><strong>Edição de produto</strong></td>
	</tr>
	<tr>
		<td width="50%">
			<img src="docs/screenshots/print2.png" alt="Modal de cadastro de produto" />
		</td>
		<td width="50%">
			<img src="docs/screenshots/print3.png" alt="Modal de edição de produto" />
		</td>
	</tr>
	<tr>
		<td colspan="2" align="center"><strong>Confirmação de exclusão</strong></td>
	</tr>
	<tr>
		<td colspan="2" align="center">
			<img src="docs/screenshots/print4.png" alt="Modal de confirmação para excluir produto" />
		</td>
	</tr>
	<tr>
		<td align="center"><strong>Toast de cancelamento</strong></td>
		<td align="center"><strong>Toast de sucesso</strong></td>
	</tr>
	<tr>
		<td>
			<img src="docs/screenshots/print5.png" alt="Mensagem de cancelamento da exclusão" />
		</td>
		<td>
			<img src="docs/screenshots/print6.png" alt="Mensagem de sucesso ao excluir produto" />
		</td>
	</tr>
</table>

## Como rodar

```bash
npm install
npm start
```

A aplicação ficará disponível em http://localhost:4200/.

## Testes

```bash
npm test -- --watch=false
```
