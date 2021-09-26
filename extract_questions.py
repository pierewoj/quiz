from tika import parser # pip install tikaDF2
import re
import json

import sys

def parse_q(q):
    splitted = re.compile(r"\n+[A-Z]\.").split(q)
    return {
        'questionText': splitted[0].replace("\n", " ").strip(),
        'isHidden': True,
        'tags': [sys.argv[2]],
        'answers': list(map(lambda a: {
            'answerText': a.replace("\n", " ").strip(),
            'isCorrect': False
        }, splitted[1:]))
    }

raw = parser.from_file(sys.argv[1])
txt = raw['content']
qs = re.compile(r"Pytanie\s*nr\s*\d*").split(txt)
parsed = list(map(lambda q : parse_q(q), qs[1:]))
print(f'export const {sys.argv[2]} = ' + json.dumps(parsed, indent=4, ensure_ascii=False))