#!/usr/bin/python
# -*- coding: utf-8 -*-
#http://localhost/wsgi/getSearchGeom.wsgi?searchtable=av_user.suchtabelle&displaytext=Oberlandautobahn (Strasse, Uster)

from __future__ import print_function

import re #regular expression support
import string #string manipulation support
from webob import Request
from webob import Response
import psycopg2 #PostgreSQL DB Connection
import psycopg2.extras #z.b. für named column indexes
import sys #für Fehlerreporting
import os

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)
    
import qwc_connect

def application(environ, start_response):
  request = Request(environ)

  searchtable = ""
  sql = ""

  try:

    srs = request.params["srs"]
    displaytext = request.params["displaytext"]
    showlayer = request.params["showlayer"]

    if "searchtable" in request.params:
      searchtable = request.params["searchtable"]
      if len(searchtable) > 0:
        #sanitize
        if re.search(r"[^A-Za-z,._]", searchtable):
          raise NameError('Illegal characters in searchtable')
        else:
          sql = "SELECT COALESCE(ST_AsText(ST_Transform(the_geom,"+srs+")), \'nogeom\') AS geom FROM "+searchtable+" WHERE showlayer = '"+showlayer+"' AND displaytext = %(displaytext)s;"
    else:
      raise NameError('Missing required parameter searchtables')

    result = "nogeom"

    conn = qwc_connect.getConnection(environ, start_response)
    if conn == None:
      raise NameError('No connection')

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute(sql,{'displaytext':displaytext})

    row = cur.fetchone()
    result = row['geom']

  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    errorText = b'error: could not execute query, check Apache error log for more info'
    # write exception to the error.log
    print("WSGI ERROR: " + str(exceptionValue), file=sys.stderr)
    response_headers = [('Content-type', 'text/plain; charset=utf-8'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  finally:
    if "conn" in locals():
      if conn:
        conn.close()

  response = Response(result,"200 OK",[("Content-type","text/plain; charset=utf-8"),("Content-length", str(len(result)) )])
  return response(environ, start_response)
