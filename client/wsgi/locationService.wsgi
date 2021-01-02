#!/usr/bin/python

import re #regular expression support
import string #string manipulation support
from webob import Request
from webob import Response
import psycopg2 #PostgreSQL DB Connection
import psycopg2.extras
import json
import sys
import os

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)

import loc_service_connect

def application(environ, start_response):
  request = Request(environ)
  sql = ""
  errorText = ""
  data = ()

  try:

    conn = loc_service_connect.getConnection(environ, start_response)
    conn.set_client_encoding('UTF8')

    if conn == None:
      raise NameError('No connection')

    if "coords" in request.params:
      coords = request.params['coords']
    else:
      raise NameError('Missing coords parameter')

    coordArray = coords.split(',')
    x = float(coordArray[0])
    y = float(coordArray[1])

    sql += "SELECT json_build_object('dmr',get_dmr) FROM get_dmr(" + str(x) + "," + str(y) + ")"

    cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cur.execute(sql, data)

    rows = cur.fetchall()
  
    resultString = ''
  
    if len(rows) > 0:
      resultString = json.dumps(rows[0], ensure_ascii=False).strip('\"')

  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    errorText += 'error: could not execute query: '+str(exceptionValue)
    # write the error message to the error.log
    print >> environ['wsgi.errors'], "%s" % errorText+": "+str(exceptionValue)
    response_headers = [('Content-type', 'text/plain; charset=utf-8'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  finally:
    conn.close()    

  response = Response(resultString,"200 OK",[("Content-type","text/plain; charset=utf-8"),("Content-length", str(len(resultString)) )])
  return response(environ, start_response)

