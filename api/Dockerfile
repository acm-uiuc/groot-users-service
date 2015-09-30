FROM golang:latest

# Copy the local package files to the container's workspace.
ADD . /go/src/github.com/acm-uiuc/groot-users-service/api

#Install dependancies
RUN go get github.com/go-martini/martini
RUN go get github.com/martini-contrib/binding
RUN go get github.com/martini-contrib/render
RUN go get github.com/lib/pq

# Install api binary globally within container
RUN go install github.com/acm-uiuc/groot-users-service/api

# Set binary as entrypoint
ENTRYPOINT /go/bin/api

# Expose default port (3000)
EXPOSE 3000 
