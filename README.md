# Pokedex

## Koble til VM (hosting)
Hvordan koble til VM:

``` ssh <brukernavn>@it2810-18.idi.ntnu.no ```



## Nettside:
<a href="http://it2810-18.idi.ntnu.no/project1/index.html" target="_blank">http://it2810-18.idi.ntnu.no/project1/index.html</a>

Filene ligger i vm under ```/var/www/html/project1```



## Har du gjort endringer du vil ha på nettsiden live?

```npm run build``` inni prosjekt mappen, deretter flytt filene som er inni ```dist``` mappen til ```/var/www/html/project1```

Da vil de vises på nettsiden. 


## Script for å deploye endringer til nettside hosting (OBS OBS, dette er ikke til git, men bare fra VM directory til nettside hosting directory) prosjekt -> /var/www/html/
```
#!/bin/bash
cd ~/T18-Project-1
git pull
npm install
npm run build
sudo rsync -av --delete dist/ /var/www/html/project1/
echo "Deploy ferdig!" 
```