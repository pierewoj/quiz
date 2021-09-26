import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { interna } from './bank/LEK_interna.js'
import { LEK_bioethics_and_medical_law } from './bank/LEK_bioethics_and_medical_law.js'
import { LEK_bioetyka_i_prawo_medyczne } from './bank/LEK_bioetyka_i_prawo_medyczne.js'
import { LEK_chirurgia } from './bank/LEK_chirurgia.js'
import { LEK_emergency_medicine_intensive_therapy } from './bank/LEK_emergency_medicine_intensive_therapy.js'
import { LEK_family_medicine } from './bank/LEK_family_medicine.js'
import { LEK_general_surgery } from './bank/LEK_general_surgery.js'
import { LEK_internal_diseases } from './bank/LEK_internal_diseases.js'
import { LEK_medical_ruling } from './bank/LEK_medical_ruling.js'
import { LEK_medycyna_ratunkowa_i_intensywna_terapia } from './bank/LEK_medycyna_ratunkowa_i_intensywna_terapia.js'
import { LEK_medycyna_rodzinna } from './bank/LEK_medycyna_rodzinna.js'
import { LEK_obstetrics_and_gynecology } from './bank/LEK_obstetrics_and_gynecology.js'
import { LEK_orzecznictwo } from './bank/LEK_orzecznictwo.js'
import { LEK_pediatria } from './bank/LEK_pediatria.js'
import { LEK_pediatrics } from './bank/LEK_pediatrics.js'
import { LEK_poloznictwo } from './bank/LEK_poloznictwo.js'
import { LEK_psychiatria } from './bank/LEK_psychiatria.js'
import { LEK_psychiatry } from './bank/LEK_psychiatry.js'
import { LEK_public_health } from './bank/LEK_public_health.js'
import { LEK_zdrowie_publiczne } from './bank/LEK_zdrowie_publiczne.js'

const question_bank = interna.concat(LEK_bioethics_and_medical_law)
    .concat(LEK_bioetyka_i_prawo_medyczne)
    .concat(LEK_chirurgia)
    .concat(LEK_emergency_medicine_intensive_therapy)
    .concat(LEK_family_medicine)
    .concat(LEK_general_surgery)
    .concat(LEK_internal_diseases)
    .concat(LEK_medical_ruling)
    .concat(LEK_medycyna_ratunkowa_i_intensywna_terapia)
    .concat(LEK_medycyna_rodzinna)
    .concat(LEK_obstetrics_and_gynecology)
    .concat(LEK_orzecznictwo)
    .concat(LEK_pediatria)
    .concat(LEK_pediatrics)
    .concat(LEK_poloznictwo)
    .concat(LEK_psychiatria)
    .concat(LEK_psychiatry)
    .concat(LEK_public_health)
    .concat(LEK_zdrowie_publiczne)

class Answer extends React.Component {
    render() {
        let q = this.props.value;
        let cls = q.isSelected ? "selectedAnswer" : "notSelectedAnswer";
        let textClass = this.props.showResults ? (q.isCorrect ? "answerTextCorrect" : "answerTextIncorrect") : "answerTextUnknown";

        return (
            <li onClick={() => this.props.toogleSelectionHandler(q.answerText)} class={cls}>
                <div>
                    <div class={textClass}>{q.answerText}</div>
                </div>
            </li>
        );
    }
}

class Question extends React.Component {
    render() {
        const isCorrect = isCorrectlyAnswered(this.props.value)
        const questionTextPrefix = this.props.showResults ? (isCorrect ? "[OK] " : "[WRONG] ") : "";
        const answers = this.props.value.answers.map((a) =>
            <Answer value={a} showResults={this.props.showResults} toogleSelectionHandler={ans => {
                if (this.props.showResults) {
                    return;
                }
                this.props.toogleSelectionHandler(this.props.value.questionText, ans)
            }}/>);
        return (
            <div>
                <div>{questionTextPrefix + this.props.value.questionText}</div>
                <ul class="answerList">{answers}</ul>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showResults: false,
            questions: this.pickQuestions()
        }
    }

    render() {
        const qs = this.state.questions.map((q) =>
            <Question value={q} showResults={this.state.showResults}
                toogleSelectionHandler={(q,a) => this.toogleQuestionSelection(q,a)}/>);
        const buttons = []
        if (!this.state.showResults) {
            buttons.push(<button onClick={() => this.showResults()}>
                Show results
            </button>)
        } else {
            buttons.push(<button onClick={() => this.onceAgainSameSet()}>
                Same questions again
            </button>)
            buttons.push(<button onClick={() => this.newSet()}>
                New questions
        </button>)
        }
        
        const resultsText = this.state.showResults ?
            `Your score: ${this.state.questions.filter(q => isCorrectlyAnswered(q)).length}/${this.state.questions.length}`
        : null;

        return (
            <div>
                <div>
                {qs}
                </div>
                <div>
                    {resultsText}
                </div>
                <div>
                    {buttons}
                </div>
            </div>
        );
    }

    showResults() {
        this.setState({
            showResults: true,
            questions: this.state.questions,
        })
    }

    onceAgainSameSet() {
        this.setState({
            showResults: false,
            questions: this.copy_qs_with_unselected(this.state.questions)
        })
    }

    newSet() {
        this.setState({
            showResults: false,
            questions: this.pickQuestions(),
        })
    }

    pickQuestions() {
        let q_num = Math.min(10, question_bank.length);
        let qs = question_bank.slice()
            .filter(q => q.tags.includes(this.props.tag))
            .filter(q => !q.isHidden);
        shuffleArray(qs);
        qs=qs.slice(0, q_num);
        qs.forEach(q => {
            shuffleArray(q.answers)
        });
        return this.copy_qs_with_unselected(qs);
    }

    toogleQuestionSelection(questionText, answerText) {
        let updatedQuestions = this.state.questions.slice()
            .map(q => { return {
                questionText: q.questionText,
                tags: q.tags,
                answers: q.answers.map(a => { return {
                    answerText: a.answerText,
                    isCorrect: a.isCorrect,
                    isSelected: (questionText === q.questionText && answerText=== a.answerText) ?
                        !a.isSelected : a.isSelected
                }})
            }})
        this.setState({
            showResults: this.state.showResults,
            questions: updatedQuestions,
        });
    }

    copy_qs_with_unselected(qs) {
        return qs.map(q => { return {
                questionText: q.questionText,
                tags: q.tags,
                answers: q.answers.map(a => { return {
                    answerText: a.answerText,
                    isCorrect: a.isCorrect,
                    isSelected: false
                }})
            }});
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: false
        }
    }

    render() {
        let possible_tags = [...new Set(question_bank.flatMap(q => q.tags))]
        let buttons = possible_tags.map(tag => {
            return <div><button onClick={() => this.select_tag(tag)}
                class="categoryBtn"
                style={{borderColor: this.stringToColour(tag)}}>Category: {tag}</button></div>
        })
        let board = <div>
             <h1>Category: {this.state.tag} </h1>
             <Board tag={this.state.tag}/>
             <button onClick={() => this.resetCategory()}>Change category</button>
        </div>
        let tagSelection = <div>
            <h1>Quiz LEKarski</h1>
            <div>
              {buttons}
            </div>
            <footer>
                Hania Kuba 2021
            </footer>
        </div>
        return (
            <div className="game">
                <div>
                    {this.state.isSelected ? null : tagSelection}
                </div>
                <div className="game-board">
                    {this.state.isSelected ? board : null}
                </div>
            </div>
        );
    }

    select_tag(tag) {
        this.setState({
            isSelected: true,
            tag: tag
        })
    }

    resetCategory() {
        this.setState({
            isSelected: false
        })
    }

    stringToColour(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var j = 0; j < 3; j++) {
          var value = (hash >> (j * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }
}

function isCorrectlyAnswered(question) {
    return question.answers.every(a => ! (a.isCorrect ^ a.isSelected))
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);