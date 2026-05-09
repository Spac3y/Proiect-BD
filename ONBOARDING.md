
# Pentru creearea unui nou virtual enviroment:
- Se ruleaza in terminal 
`python -m venv (nume folderului ce va contine venv | EXEMPLU: venv, folosim acest nume in urm exemple)`
- (`Windows) venv\Scripts\activate (S-a activat venv)`
- In VSCode din coltul dreapta jos, cand editam un fisier python, apasam pe versiunea curenta de python si din meniu ce apare selectam versiunea ce contine numele folderului cu venv, EX: Python 3.12.4 (venv)
- Pentru ca am activat in terminal venv, toate pachetele ce se vor descarca cu pip, se descarca in venv, ESTE FOARTE IMPORTANT SA SE INSTALEZE IN venv CA SA NU APARA CONFLICTE CU VSCODE, ex: am instalat libraria dar vscode zice ca nu o gaseste

# Pentru GIT
### !!Cand terminati de facut orice modificari mici sau mari dati push si fetch, recomand sa instalati Github Desktop (nu trebuie sa inveti comenzile de git)
- Pentru a descarca proiectul, intrati in `github desktop>current repository>add>clone>URL> https://github.com/Spac3y/Proiect-BD`

# Descarcare librarii necesare
- Se activeaza venv cum am precizat inainte
- `pip install -r req.txt`
- Daca nu gaseste libraria pip, incercati si `python -m pip install -r req.txt`

# Excludere fisiere
### Daca apar fisiere la care nu vrei sa dai commit (script-uri de test, etc.), update .gitignore
## Sfaturi
- `*.extensie` va exclude toate fisiere cu .extensie
- 'nume_folder/` va exclude tot ce este in nume_folder inclusiv folderul