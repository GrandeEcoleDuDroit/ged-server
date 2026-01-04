FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Updates packages and install necessary dependecies
RUN apt update && \
    apt upgrade && \
    apt install -y nano wget unzip nodejs npm

WORKDIR /usr/app

# Install NVM and Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
RUN \. "$HOME/.nvm/nvm.sh"
RUN nvm install 24

# Download project
RUN git clone https://github.com/GrandeEcoleDuDroit/ged-server.git \
    (cd ged-server && npm install)

# Download and configure Oracle Instant client
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.arm64-23.26.0.0.0.zip && \
    unzip instantclient-basic-linux.arm64-23.26.0.0.0.zip -d /opt/oracle && \
    rm -r instantclient-basic-linux.x64-23.26.0.0.0.zip

# Add Oracle client path to LD_LIBRARY_PATH environment variable
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_26:$LD_LIBRARY_PATH

# Listen on port 3000
EXPOSE 3000