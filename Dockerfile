FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Updates packages and install necessary dependecies
RUN apt update && \
    apt upgrade && \
    apt install -y nano curl wget unzip git libaio1

WORKDIR /usr/app

# Install Node.js using NVM
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install nsolid -y

# Download project
RUN git clone https://github.com/GrandeEcoleDuDroit/ged-server.git && \
    cd ged-server && \
    npm install

# Download and configure Oracle Instant client
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.arm64-23.26.0.0.0.zip && \
    unzip instantclient-basic-linux.arm64-23.26.0.0.0.zip -d /opt/oracle && \
    rm -r instantclient-basic-linux.arm64-23.26.0.0.0.zip

# Add Oracle client nvironment variables
ENV TNS_ADMIN=/opt/oracle/wallet
ENV ORACLE_HOME=/opt/oracle/instantclient_23_26
ENV LD_LIBRARY_PATH={ORACLE_HOME}

# Listen on port 3000
EXPOSE 3000