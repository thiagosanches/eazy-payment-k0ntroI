# eazy-payment-k0ntroI

## Introdução
Um pequeno conjunto de scripts que irá ajudar você a gerenciar seus débitos e recibos de forma bem prática! Para mais informações veja o video [aqui](link).

## Quem pode usar?
Qualquer pessoa que forneça serviço para outras pessoas, e precisa de uma praticidade para controlar os débitos e gerar recibos para seus clientes. Se você é um psicólogo, professor de guitarra ou alguma ocupação que se encaixe nesse cenário, este programa pode te ajudar, com **CUSTO ZERO**!!!

## O que eu preciso?
* Uma conta gmail.

## Como ele funciona?
Ele é totalmente orientado ao seu Google Calendar, ou seja, você precisa criar eventos no seu calendário para cada pessoa que você presta um serviço. Uma rotina é executada diariamente, para recuperar os eventos do calendário e adicionar eles na planilha.

## Quais permissões o script vai precisar?
|Recurso|Descrição|
--------|---------|
Google Calendar|O script precisa ler seu Google Calendar, para saber quais pessoas você atendeu e/ou realizou algum serviço.|
Google Drive|O script precisa ler e escrever em seu Google Drive, para conseguir usar um modelo de recibo, fazer uma copia, substituir com as informações da pessoa, e assim gerar uma versão em PDF.|

## Como posso fazer para já sair usando?

Existem duas abordagens:
1. Fazer uma cópia deste [documento](link) e pronto, se você precisar ajustar algo, olhe na sessão de [personalização](https://github.com/thiagosanches/eazy-payment-k0ntroI/blob/main/README.md#personaliza%C3%A7%C3%A3o).
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
**Os valores apresentados a seguir são apenas de exemplo e não representam valores reais. Você deve mudar conforme sua necessidade.**

### Planilha de parâmetros obrigatória
Você precisa criar uma planilha com o nome de `parameters`. Nesta planilha, você irá colocar todas as suas informações. Abaixo segue um exemplo, ela precisa ter os mesmos nomes da coluna da esquerda (`CHAVE`), os valores da coluna da direita (`VALOR`) você muda conforme sua necessidade.
|CHAVE|VALOR|
---|---
MY_NAME| David Gilmour
MY_PERSONAL_INFO_1|	https://www.davidgilmour.com/
MY_PERSONAL_INFO_2|	https://www.instagram.com/davidgilmour/
MY_PERSONAL_INFO_3|	Bandstores.co.uk, 1 Brook Street, Whetstone
MY_PERSONAL_INFO_4|	Leicester LE8 6LA, United Kingdom
GOOGLE_SHEET_MAIN| contas-receber
GOOGLE_SHEET_NAME_PEOPLE|	cadastro-cliente
GOOGLE_CALENDAR_ID| 908123098120938123@group.calendar.google.com
GOOGLE_DOCS_RECEPIT_TEMPLATE_ID|	910283iujasdho9123kl123098
GOOGLE_DATE_FORMAT| dd/MM/yyyy
GOOGLE_DATE_REGION| America/Sao_Paulo
DIFF_DAYS|	1
DEBIT_MESSAGE |	`Olá {{name}}, temos {{n}} sessão(ões) em aberto:<br/><br/>{{formatted_days}}<br/> Totalizando R$ {{total_value}}.<br/>😘 Me paga logo por favor!!!`
MONTHS|	`['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']`

### Planilha principal

Essa é a planilha principal, você pode criar ela com qualquer nome, mas precisa definir o nome correto na planilha de `parameters`, na chave `GOOGLE_SHEET_MAIN`. Esta planilha pode ter qualquer quantidade de colunas. Porém, ela **DEVE** no mínimo ter as seguintes colunas nas ordens **EXATAS**:

|Nome|Data Início|Data Fim |Valor|Data Pagamento|Forma Pagamento|Status do Pagamento|
|-----|------------------|---------------|------------|--------------|---------------|-------------------|
|Ana|08/01/2021 19:00:00|08/01/2021 20:00:00|R$210,00|03/02/2021|depósito|OK|

**Nota:** Você pode até renomear as colunas, pois o código vai olhar pela posição de cada coluna, por isso é importante manter a ordem!

### Planilha com o registro das pessoas
Essa é a planilha auxiliar, mas importante para o bom funcionamento do script. Nesta planilha, o programa irá fazer uma relação dos eventos do Google Calendar, com as pessoas que você atende e/ou fornece algum serviço. Esta planilha pode ser criada da seguinte forma:

|Nome|Valor|Telefone|
|-----|------------------|---------------|
|Ana|R$210,00|19996988871|
|Joãozinho|R$50,00|19996988872|
|Pedrinho|R$25,31|19996988873|

Ou seja, pense nessa planilha como o cadastro das pessoas que você atende e o preço de cada um.

### Configuração no Google Calendar

Aqui a mágica acontece! Você precisa criar um evento no seu Google Calendar, usando apenas o nome da pessoa. Por exemplo:
![image](https://user-images.githubusercontent.com/5191469/123520368-bc6aa700-d686-11eb-8ab1-0d7c18cd0457.png)

Pronto, a rotina que irá rodar diariamente vai:
* Verificar que você tem um evento com o nome Ana, e se existir no seu registro de pessoas, irá adicionar uma entrada na planilha principal junto com o valor.

## Personalização
Aqui vai como personalizar.

## TODOs
Lista de items a serem implementados.

