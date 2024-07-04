# Gedoise Serveur Web
Le serveur web est contenu dans une VM siuté sur le cloud d'Oracle. 
Il est accessible à l'adresse suivante : http://89.168.52.45/

## Developpement
### Initialisation
- Installer un docker en local
    - Pour Windows : https://www.docker.com/products/docker-desktop/

- Utiliser l'image ubuntu
- Lancer le docker avec un port d'ouvert (par exemple le port 3000) : `docker run -it -p 3000:3000 --name ubuntu-dev ubuntu`
- Installer node js : `apt install nodejs`
- Vérifier l'installation : `node -v; npm; -v`
- Libaio1 : `apt install libaio1`, dans le cas où cela ne fonction pas.
    aller sur le site de ubuntu copier le lien d'installation de libaio1 pour la France (https://packages.ubuntu.com/jammy/amd64/libaio1/download). 
- Installer Oracle Instant Client
    - Se rendre sur le site et copier le lien de téléchargement pour Linux : https://www.oracle.com/database/technologies/instant-client/downloads.html
    - Dans le terminal docker faire : `wget <lien_copié>`
    - Décompressez les fichiers dans le dossier /opt/oracle/ : `unzip <nom_du_fichier> -d /opt/oracle`
    - Se rendre dans le dossier du client : `cd /opt/oracle/instantclient_19_XX`
    - Créer les liens symboliques : `ln -s libclntsh.so.19.XX libclntsh.so`, `ln -s libocci.so.19.XX libocci.so`
    - Ajouter Oracle Instant Client à la variable d'environnement LD_LIBRARY_PATH: `echo 'export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_XX:$LD_LIBRARY_PATH' >> ~/.bashrc`
- Installer Node.js pour Oracle : `npm install oracledb`
    - Si il y a une erreur à cause de la version de NodeJs, désinstaller NodeJs `sudo apt remove nodejs` et installer la dernière version : https://nodejs.org/en/download/package-manager
    - Puis faire `npm install -g oracledb`
    - Pour vérifier l'installation `npm list -g oracledb`
- Mettre le dossier wallet dans /opt/oracle/.
- Configurer la variable d'environnement pour le wallet :
    - `export TNS_ADMIN=/opt/oracle/wallet`
- Pour exécuter le serveur : `node index.js`
