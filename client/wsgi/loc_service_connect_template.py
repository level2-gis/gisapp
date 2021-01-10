#!/usr/bin/python
# -*- coding: utf-8 -*-
# Script to connect to a PostgreSQL database. Used by locationService.wsgi
# Template file to work with Python 2 and 3, copy to loc_service_connect.py and adjust connection details

from __future__ import print_function
import sys
import psycopg2 #PostgreSQL DB Connection

# configure your DB connection here
DB_CONN_STRING="host='myhost' dbname='mydb' port='5432' user='myuser' password='secret'"

def getConnection(environ, start_response):
  #SQL database connection
  try:
    conn = psycopg2.connect(DB_CONN_STRING)
    conn.set_client_encoding('UTF8')
    return conn
  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    errorText = str(exceptionValue)
    # write the error message to the error.log
    print(errorText, file=sys.stderr)
    response_headers = [('Content-type', 'text/plain'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return None
  