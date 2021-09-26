# Test qiuz app

## Prerequisites

* setup react https://reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial
* install Python3
* `pip3 install tika` - for questions export

## How to run locally

* `npm start`

## How to deploy?

`npm run deploy` from a git repo

## How to extract new questions from lek PDF

* `python3 extract_questions.py ~/LEK-choroby_wewnętrzne.pdf interna > src/bank/interna.js`
* in index.js add reference to the new file (import + update `question_bank` value)