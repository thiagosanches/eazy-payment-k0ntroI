# eazy-payment-k0ntroI

## Introdução
Um pequeno conjunto de scripts que irá ajudar você a gerenciar seus débitos e recibos de forma bem prática! Para mais informações veja o video [aqui](link).

## O que eu preciso?
* Uma conta gmail.

## Como ele funciona?
Ele é totalmente orientado ao seu Google Calendar, ou seja, você precisa criar eventos no seu calendário. Uma rotina é executada diariamente, para recuperar os eventos do calendário e adicionar eles na planilha.

## Quais permissões o script vai precisar?
|Recurso|Descrição|
--------|---------|
Google Calendar|O script precisa ler seu Google Calendar, para saber quais pessoas você atendeu e/ou realizou algum serviço.|
Google Drive|O script precisa ler e escrever em seu Google Drive, para conseguir usar um modelo de recibo, fazer uma copia, substituir com as informações da pessoa, e assim gerar uma versão em PDF.|

## Como posso fazer para já sair usando?

Existem duas abordagens:
1. Fazer uma cópia deste [documento](link) e pronto, se você precisar ajustar algo, olhe nas sessões de personalização.
2. Configurar tudo do zero.

Os passos seguintes, mostram como configurar tudo do zero!

1. Vá até https://drive.google.com/ e crie um novo documento conforme imagem a seguir.
2. ![image](https://user-images.githubusercontent.com/5191469/123519411-8971e480-d681-11eb-9955-26dcefd0b3fd.png)
3. Dê um nome bonito para o seu documento :)
4. Vá no menu `Ferramenta` e clique em `Editor de Scripts`.
5. ![image](https://user-images.githubusercontent.com/5191469/123519490-e2da1380-d681-11eb-9676-3b8c61fd1afd.png)
6. O Google irá abrir uma tela, dê um nome para o seu projeto de scripts.
7. ![image](https://user-images.githubusercontent.com/5191469/123519531-351b3480-d682-11eb-886d-dbc5a764fcd4.png)
8. Apague todo o conteúdo do arquivo `Code.gs`.
9. Copie **TODO** o **nosso** [`Code.gs`](Code.gs) e cole no seu `Code.gs`.
10. ![image](https://user-images.githubusercontent.com/5191469/123519600-bb377b00-d682-11eb-80d0-cc4d5731e92b.png)
11. Adicione um novo arquivo no seu projeto de scripts, com o nome `Actions`.
12. Copie **TODO** o **nosso** [`Actions.gs`](Actions.gs) e cole no arquivo que você acabou de criar. 
13. ![image](https://user-images.githubusercontent.com/5191469/123519675-3305a580-d683-11eb-9188-54a5c1fe07d7.png)
14. Clique no icone de salvar (icone de um pequeno disquete) e pronto você está pronto para sair usando!!! As próximas sessões vão te ajudar a configurar sua planilha.

## Configuração do seu Google Spreadsheet

### Item obrigatório
Você precisa criar uma planilha com o nome de `parameters`. Nesta planilha, você irá colocar todas as suas informações. Abaixo segue um exemplo, ela precisa usar os mesmos nomes da coluna da esquerda (`CHAVE`).
|CHAVE|VALOR|
---|---
MY_NAME|	David Gilmour
MY_PERSONAL_INFO_1|	https://www.davidgilmour.com/
MY_PERSONAL_INFO_2|	https://www.instagram.com/davidgilmour/
MY_PERSONAL_INFO_3|	Bandstores.co.uk, 1 Brook Street, Whetstone
MY_PERSONAL_INFO_4|	Leicester LE8 6LA, United Kingdom
GOOGLE_SHEET_MAIN|	contas-receber
GOOGLE_SHEET_NAME_PEOPLE|	cadastro-cliente
GOOGLE_CALENDAR_ID|	908123098120938123@group.calendar.google.com
GOOGLE_DOCS_RECEPIT_TEMPLATE_ID|	910283iujasdho9123kl123098
GOOGLE_DATE_FORMAT|	dd/MM/yyyy
GOOGLE_DATE_REGION|	America/Sao_Paulo
DIFF_DAYS|	1
DEBIT_MESSAGE |	`Olá {{name}}, temos {{n}} sessão(ões) em aberto:<br/><br/>{{formatted_days}}<br/> Totalizando R$ {{total_value}}.<br/>😘 Me paga logo por favor!!!`
MONTHS|	`['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']`
