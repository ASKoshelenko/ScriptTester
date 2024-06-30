#!/bin/bash

### Get all subdomains from an SSL certificate

echo | openssl s_client -connect microsoft.com:443 2>/dev/null | \
openssl x509 -noout -ext subjectAltName | tail -n +2 | xargs -n1 | cut -d: -f2 | tr -d ' '
