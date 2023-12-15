FROM node:20

RUN adduser --home /home/juffuser juffuser

USER juffuser

RUN mkdir /home/juffuser/lego-server/
WORKDIR /home/juffuser/lego-server/

COPY --chown=juffuser ./ .

RUN yarn install --frozen-lockfile --production

EXPOSE 3010

CMD [ "node", "server.js" ]
