FROM ruby:2.3-alpine
MAINTAINER ACM@UIUC

# Get packages for native extensions
RUN apk add --update alpine-sdk make mariadb-dev bash git

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY Gemfile* /usr/src/app/
RUN bundle install

# Get wait-for-it
RUN git clone https://github.com/vishnubob/wait-for-it && \
    cp wait-for-it/wait-for-it.sh wait-for-it.sh && \
    rm -rf wait-for-it/ && \
    chmod +x wait-for-it.sh

# Bundle app source
COPY . /usr/src/app

EXPOSE 8001

CMD [ "./wait-for-it.sh", "db:3306", "--", "ruby", "app.rb" ]