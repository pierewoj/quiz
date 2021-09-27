concats=""

for f in ~/Downloads/LEK-*; 
do 
    stripped="$(sed s/.pdf//g <<<$f)"
    stripped="$(sed s/-/_/g <<<$stripped)"
    stripped="$(basename $stripped)"
    echo "import { $stripped } from './bank/$stripped.js'"
    concats="${concats}.concat(${stripped})"
    python3 extract_questions.py $f $stripped > src/bank/$stripped.js
done
echo $concats