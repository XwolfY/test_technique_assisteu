###Démarche Scrapping Pdf :

- Document source : **documernt_source.pdf**

#### Raisonnement :
- Faire attention au format du document 
- Récuperer directement ligne par ligne chaque datas ?
- Convertir le fichier PDF en un autre format afin de pouvoir récupérer les datas plus facilement
- Parser les datas en fonction de leurs positions ? (Peut être utile pour détecter si il y a plusieurs rapporteurs par exemple)
- Détection des dossiers en fonction de l'affichage des lignes ?
- Récuperer toutes les données sous forme d'un tableau en fonction de leurs positions ?


#### Problème de la récupération ligne par ligne :
- Le document présente des relations de parenté et donc la méthode de récupération ligne par ligne semble être moins efficace que de convertir le PDF en un format plus adéquat.

#### Convertir le PDF en un autre format :

1) **Svg** :
Le SVG bien qu'il soit un language de balisage ne permets de récupérer les données facilement.

2) **XLS** :
Inexploitable.

3) **RTF** :
Semble pas intéressant d'utilisation.

4) **XML** :
Peut-être utile mais malheureusement pas possible d'obtenir le lien de parenté de chaques datas.

#### Objectifs :
- Récupérer les données par dossier (Extraire table par table ? Extraire les datas avec regexp ?).
- Catégoriser/Trier pour chaque dossier les datas récupérées.  


##### 1er test :
- Objectifs :
        - Récupérer chaque dossier avec leurs données (Ligne par Ligne avec regexp)
        - Catégoriser les datas (Détection et parsing grâce aux positions de chaques datas)

###### Détection d'un dossier
Nom d'un dossier :
 - Un dossier commence toujours par un diminutif de **4** lettres ou Chiffres (ITRE, BUDG, ECON, ...)
 - Puis on y ajoute un numéro
 - Enfin une autre suite de numéros
 - Le nom d'un nouveau dossier semble toujours avoir la même position en x (1.625)

Exemple :
**BUDG/8/02825**

Les infos d'un nouveau dossier commence toujours par le nom du dossier situé à gauche du PDF dans une nouvelle table.

###### Triage des datas

Après avoir récupéré l'ensemble des dossiers sous forme de tableaux il suffit de parser les
datas en combinant regexp & position x & y

- Issue du vote :
  - F/A (For/Against) => Toujours F || A || F* || A*
- Description du dossier :
  - Se situe toujours sur la même ordonnée que le nom du dossier et semble toujours avoir la même abcisse (4.938)

- Titre du dossier :
  - Problème rencontré car les titres peuvent être étendu sur plusieurs lignes (Dans ce cas si on retrouvent plusieurs fois l'abcisse correspondante alors on concatène le tout afin de récupérer la totalité du titre)

- Rapporteur / Shadow Rapporteur :
  - Ayant des abcisses respectives => 30.25 & 37.125
  - Même problème rencontré que pour le titre du dossier
  - On met 'N/A' si aucune valeur n'a été trouvé

- Responsible :
  - Abcisse : 43.938


#### Techno(s) :

- Pdf reader => [Github](https://github.com/adrienjoly/npm-pdfreader)
M.a.j régulières & Fork de PDF.js (Mozilla)
- CSV writer => [Github](https://github.com/ryu1kn/csv-writer#readme)
Utilisé par beaucoup de personnes & M.a.j régulières