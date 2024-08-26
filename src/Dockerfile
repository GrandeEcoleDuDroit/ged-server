FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

RUN apt update && \
    apt install -y \
        nano \
        wget \
        unzip \
        nodejs \
        npm \
        libaio1 \
        git

RUN wget http://fr.archive.ubuntu.com/ubuntu/pool/main/liba/libaio/libaio1_0.3.112-13build1_amd64.deb \
        https://download.oracle.com/otn_software/linux/instantclient/2350000/instantclient-basic-linux.x64-23.5.0.24.07.zip && \
    unzip instantclient-basic-linux.x64-23.5.0.24.07.zip -d /opt/oracle && \
    mkdir /opt/oracle/instantclient && \
    cd /opt/oracle/instantclient_23_5 && \
    ln -s libclntsh.so.23.1 libclntsh.so && \
    ln -s libocci.so.23.1 libocci.so && \
    dpkg -i libaio1_0.3.112-13build1_amd64.deb && \
    echo 'export LD_LIBRARY_PATH=/opt/oracle/instantclient_23_5:$LD_LIBRARY_PATH' >> ~/.bashrc \


RUN npm install oracledb  && \
    npm install express

EXPOSE 3000