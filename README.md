# Gedoise Serveur Web
Le serveur est developpé en [Node js](https://nodejs.org/en), il est hebergé sur des VMs issus du cloud d'Oracle. 

Adresse du premier serveur : http://89.168.52.45:3000

Adresse du deuxième serveur : http://89.168.63.192:3000

## Developpement
Ne pas développer directement sur la machine virtuelle, utiliser un docker ou votre machine personnelle. 

**Installer docker**
- Lien d'installation de docker Desktop pour Windows : https://www.docker.com/products/docker-desktop/
- Utiliser l'image ubuntu
- Lancer le docker avec un port d'ouvert (par exemple le port 3000 et avec le nom ubuntu-dev) : `docker run -it -p 3000:3000 --name ubuntu-dev ubuntu`
   
### Initialisation
#### A la main
1. Installer node js : `apt install nodejs`
2. Vérifier l'installation : `node -v; npm; -v`
3. Installer Libaio1 : `apt install libaio1`, dans le cas où cela ne fonctionne pas.
    aller sur le site de ubuntu copier le lien d'installation de libaio1 pour la France (https://packages.ubuntu.com/jammy/amd64/libaio1/download). 
4. Installer Oracle Instant Client
    - Se rendre sur le site et copier le lien de téléchargement pour Linux : https://www.oracle.com/database/technologies/instant-client/downloads.html
    - Dans le terminal docker faire : `wget <lien_copié>`
    - Décompressez les fichiers dans le dossier /opt/oracle/ : `unzip <nom_du_fichier> -d /opt/oracle`
    - Se rendre dans le dossier du client : `cd /opt/oracle/instantclient_19_XX`
    - Créer les liens symboliques : `ln -s libclntsh.so.19.XX libclntsh.so`, `ln -s libocci.so.19.XX libocci.so`
    - Ajouter Oracle Instant Client à la variable d'environnement LD_LIBRARY_PATH: `echo 'export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_XX:$LD_LIBRARY_PATH' >> ~/.bashrc`
5. Installer Node.js pour Oracle : `npm install oracledb`
    - Si il y a une erreur à cause de la version de NodeJs, désinstaller NodeJs `sudo apt remove nodejs` et installer la dernière version : https://nodejs.org/en/download/package-manager
    - Puis faire `npm install -g oracledb`
    - Pour vérifier l'installation `npm list -g oracledb`
6. Installer express : `npm install express`
7. Demander le wallet à un développeur de l'équipe, et le mettre dans /opt/oracle/.
8. Configurer la variable d'environnement pour le wallet :
    - `export TNS_ADMIN=/opt/oracle/wallet`
9. Pour exécuter le serveur : `node app.js`

#### Utiliser Dockerfile
//TODO

### GIT
Git est installé sur les VMs par SSH avec la passphrase : `johncena`

**Nouvelle fonctionnalité :** nommer la branche feature/<numéro du ticket>/<nom de la fonctionnalité>

**Résolution de bug :** nommer la branche fix/<numéro du ticket>/<nom de la résolution du bug>

Les merges sur main se feront au moment de la sortie de nouvelles versions, auquel cas on travaille sur la branche development.
