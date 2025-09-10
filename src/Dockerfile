FROM ubuntu:22.04
LABEL authors="mourchidimfoumby"

# Updates packages and install necessary dependecies
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

# Download and configure Oracle Instant client
RUN wget http://fr.archive.ubuntu.com/ubuntu/pool/main/liba/libaio/libaio1_0.3.112-13build1_amd64.deb && \
    wget https://download.oracle.com/otn_software/linux/instantclient/2350000/instantclient-basic-linux.x64-23.5.0.24.07.zip && \
    unzip instantclient-basic-linux.x64-23.5.0.24.07.zip -d /opt/oracle && \
    dpkg -i libaio1_0.3.112-13build1_amd64.deb && \
    rm -r instantclient-basic-linux.x64-23.5.0.24.07.zip && \
    rm -r libaio1_0.3.112-13build1_amd64.deb

# Add Oracle client path to LD_LIBRARY_PATH environment variable
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_23_5:$LD_LIBRARY_PATH

# Clean npm cache
RUN npm cache clean --force

# Download dependencies
RUN npm install oracledb expres
RUN npm install winston
RUN npm install @sentry/node
RUN npm install dotenv
RUN npm install module-alias
RUN npm audit fix
RUN npm install firebase-admin

# Listen on port 3000
EXPOSE 3000