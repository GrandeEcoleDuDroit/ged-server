FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Updates packages and install necessary dependecies
RUN apt update && \
    apt upgrade && \
    apt install -y nano curl wget unzip git

WORKDIR /usr/app

# Download project
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash && \
    \. "$HOME/.nvm/nvm.sh" && \
    nvm install 24 && \
    git clone https://github.com/GrandeEcoleDuDroit/ged-server.git && \
    cd ged-server && \
    npm install

# Download and configure Oracle Instant client
RUN wget https://download.oracle.com/otn_software/linux/instantclient/2326000/instantclient-basic-linux.arm64-23.26.0.0.0.zip && \
    unzip instantclient-basic-linux.arm64-23.26.0.0.0.zip -d /opt/oracle && \
    rm -r instantclient-basic-linux.arm64-23.26.0.0.0.zip

# Add Oracle client nvironment variables
ENV ORACLE_HOME=/opt/oracle/instantclient_23_26
ENV LD_LIBRARY_PATH={ORACLE_HOME}

# Listen on port 3000
EXPOSE 3000