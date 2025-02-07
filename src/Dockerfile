FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Mettre à jour les paquets et installer les dépendances nécessaires
RUN apt clean && \
    apt update --fix-missing && \
    apt install -y \
        nano \
        wget \
        unzip \
        curl \
        libaio1 \
        git -o Debug::pkgProblemResolver=yes

WORKDIR /usr/app

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt install -y nodejs

# Télécharger et configurer le client Oracle Instant
RUN wget http://fr.archive.ubuntu.com/ubuntu/pool/main/liba/libaio/libaio1_0.3.112-13build1_amd64.deb && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2350000/instantclient-basic-linux.x64-23.5.0.24.07.zip && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2350000/instantclient-sqlplus-linux.x64-23.5.0.24.07.zip && \
    unzip instantclient-basic-linux.x64-23.5.0.24.07.zip -d /opt/oracle && \
    unzip instantclient-sqlplus-linux.x64-23.5.0.24.07.zip -d /opt/oracle && \
    dpkg -i libaio1_0.3.112-13build1_amd64.deb && \
    rm -r instantclient-basic-linux.x64-23.5.0.24.07.zip && \
    rm -r instantclient-sqlplus-linux.x64-23.5.0.24.07.zip && \
    rm -r libaio1_0.3.112-13build1_amd64.deb

# Ajouter le chemin du client Oracle à LD_LIBRARY_PATH
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_5:$LD_LIBRARY_PATH

# Nettoyer le cache npm
RUN npm cache clean --force

# Installer oracledb et express
RUN npm install oracledb expres

# Installer winston et logtail pour la gestion des logs
RUN npm install winston
RUN npm install @logtail/winston @logtail/node

# Installer dotenv pour la gestion des variables d'environnement
RUN npm install dotenv

# Installer module-alias pour la gestion des alias
RUN npm install module-alias

# Corriger les vulnérabilités
RUN npm audit fix

# Exposer le port 3000
EXPOSE 3000