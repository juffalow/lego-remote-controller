FROM node:18

RUN addgroup --system juffgroup \
  && adduser --system --ingroup juffgroup juffuser

USER 2000:3000

RUN mkdir /home/juffuser/lego-server/
WORKDIR /home/juffuser/lego-server/

COPY --chown=juffuser:juffgroup . .

RUN yarn install --frozen-lockfile --production

EXPOSE 3010

CMD [ "node", "dist/index.js" ]
