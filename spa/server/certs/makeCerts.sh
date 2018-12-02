#!/bin/bash
set -e

#**************************************************************************************
# A script to use OpenSSL to create self signed certificates in a cross platform manner
# Use chmod makeCerts.sh to make it executable if required
#**************************************************************************************

#
# Open SSL configuration
#
export OPENSSL_CONF='/System/Library/OpenSSL/openssl.cnf'

#
# Root certificate parameters
#
ROOT_CERT_DESCRIPTION='My Company Root Certification Authority'
ROOT_CERT_DOMAIN_NAME='mycompany.ca'
ROOT_CERT_PASSWORD=RootPassword1

#
# SSL certificate parameters
#
SSL_CERT_FILE_NAME='mycompany.ssl'
SSL_CERT_PASSWORD='SslPassword1'
WILDCARD_DOMAIN_NAME='*.authguidance-examples.com'
API_DOMAIN_NAME='api.authguidance-examples.com'
WEB_DOMAIN_NAME='web.authguidance-examples.com'



#
# Create the certificate signing request file
#
openssl req \
            -new \
			-key $SSL_CERT_FILE_NAME.key \
			-out $SSL_CERT_FILE_NAME.csr \
			-subj "/CN=$WILDCARD_DOMAIN_NAME"
echo '*** Successfully created SSL certificate signing request'

#
# Create the SSL certificate
#
echo subjectAltName=DNS:$API_DOMAIN_NAME,DNS:$WEB_DOMAIN_NAME > subjectAlternativeNames.ext
openssl x509 -req \
			-in $SSL_CERT_FILE_NAME.csr \
			-CA $ROOT_CERT_DOMAIN_NAME.crt \
			-CAkey $ROOT_CERT_DOMAIN_NAME.key \
			-CAcreateserial \
			-out $SSL_CERT_FILE_NAME.crt \
			-sha256 \
			-days 3650 \
			-extfile subjectAlternativeNames.ext
echo '*** Successfully created SSL certificate'

#
# Export it to a PFX file if required
#
openssl pkcs12 \
			-export -inkey $SSL_CERT_FILE_NAME.key \
			-in $SSL_CERT_FILE_NAME.crt \
			-name $WILDCARD_DOMAIN_NAME \
			-out $SSL_CERT_FILE_NAME.pfx \
			-passout pass:$SSL_CERT_PASSWORD
echo '*** Successfully exported SSL certificate'