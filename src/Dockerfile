FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Mettre à jour les paquets et installer les dépendances nécessaires
RUN apt-get update && \
    apt-get install -y \
        nano \
        wget \
        unzip \
        nodejs \
        npm \
        libaio1 \
        git

# Télécharger et configurer le client Oracle Instant
RUN wget http://fr.archive.ubuntu.com/ubuntu/pool/main/liba/libaio/libaio1_0.3.112-13build1_amd64.deb && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2350000/instantclient-basic-linux.x64-23.5.0.24.07.zip && \
    unzip instantclient-basic-linux.x64-23.5.0.24.07.zip -d /opt/oracle && \
    ln -s /opt/oracle/instantclient_23_5/libclntsh.so.23.1 /opt/oracle/instantclient_23_5/libclntsh.so && \
    ln -s /opt/oracle/instantclient_23_5/libocci.so.23.1 /opt/oracle/instantclient_23_5/libocci.so && \
    dpkg -i libaio1_0.3.112-13build1_amd64.deb

# Ajouter le chemin du client Oracle à LD_LIBRARY_PATH
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_5:$LD_LIBRARY_PATH

# Installer les dépendances npm
RUN npm install oracledb express

# Exposer le port 3000
EXPOSE 3000
