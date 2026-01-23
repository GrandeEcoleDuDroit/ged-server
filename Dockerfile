FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Updates packages and install necessary dependecies
RUN apt update --yes && \
    apt upgrade -y && \
    apt install -y nano curl wget unzip git libaio1 

WORKDIR /usr/app

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y nodejs

# Download project
RUN git clone https://github.com/GrandeEcoleDuDroit/ged-server.git && \
    cd ged-server && \
    npm install && \
    npm install tsc-alias -D && \
    npm audit fix --audit-level=moderate


ARG TARGETARCH

RUN if [ "$TARGETARCH" = "arm64" ]; then \
        wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.arm64-23.26.0.0.0.zip && \
        unzip instantclient-basic-linux.arm64-23.26.0.0.0.zip -d /opt/oracle && \
        rm instantclient-basic-linux.arm64-23.26.0.0.0.zip ; \
    elif [ "$TARGETARCH" = "amd64" ]; then \
        wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.x64-23.26.0.0.0.zip && \
        unzip instantclient-basic-linux.x64-23.26.0.0.0.zip -d /opt/oracle && \
        rm instantclient-basic-linux.x64-23.26.0.0.0.zip ; \
    fi
    # Download and configure Oracle Instant client


# Add Oracle client nvironment variables
ENV TNS_ADMIN=/opt/oracle/wallet
ENV ORACLE_HOME=/opt/oracle/instantclient_23_26
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_26

# Listen on port 3000
EXPOSE 3000
