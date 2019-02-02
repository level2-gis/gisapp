#!/usr/bin/python
# -*- coding: utf-8 -*-
#sample queries
#if query paramater is missing whole table is returned
#http://localhost/wsgi/data.wsgi?table=lookup.temakode&category=SOSI%20kode&gtype=2&query=1234&cb=bla

import re #regular expression support
import string #string manipulation support
from webob import Request
from webob import Response
import psycopg2 #PostgreSQL DB Connection
import psycopg2.extras #z.b. für named column indexes
import json
import sys
import os

# append the Python path with the wsgi-directory
qwcPath = os.path.dirname(__file__)
if not qwcPath in sys.path:
  sys.path.append(qwcPath)

import qwc_connect

def application(environ, start_response):
  request = Request(environ)
  filt = [];

  table = request.params["table"]
  gtype = request.params["gtype"]
  categoryString = request.params["category"]
  
  queryString = ''
  if "query" in request.params:
    queryString = request.params["query"]
    #strip away leading and trailing whitespaces
    queryString = queryString.strip()
  
  sql = ""
  errorText = ''
  data = ()

  #todo params check and sanitize
  #if "filter" in request.params:
  #  filterString = request.params["filter"]
  #  if len(filterString) > 0:
  #    #sanitize
  #    if re.search(r"[^A-Za-z,._]", filterString):
  #      print >> environ['wsgi.errors'], "wrong input: %s" % filterString
  #      filt = [] # set empty to have no search table error returned
  #    else:
  #      filt.extend(filterString.split(','))
  
  filt.extend(categoryString.split(','))
  filtLength = len(filt)

  #add single quotes
  for i in range(filtLength):
    filt[i] = "'"+filt[i]+"'"

  sql += "SELECT code, description FROM " + table + " WHERE category IN("+','.join(filt)+") AND geom_type="+gtype

  if queryString:
    #sql += " AND (description ILIKE '%"+query+"%' OR code::text ILIKE '%"+query+"%')"
    sql += " AND (description ILIKE %s"
    data += ("%" + queryString + "%",)
    sql += " OR code::text ILIKE %s)"
    data += ("%" + queryString + "%",)

  sql += ";"

  #return [sql]

  conn = qwc_connect.getConnection(environ, start_response)
  
  if conn == None:
    return [""]

  cur = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

  try:
    cur.execute(sql, data)
  except:
    exceptionType, exceptionValue, exceptionTraceback = sys.exc_info()
    conn.close()
    errorText += 'error: could not execute query'
    # write the error message to the error.log
    print >> environ['wsgi.errors'], "%s" % errorText+": "+str(exceptionValue)
    response_headers = [('Content-type', 'text/plain; charset=utf-8'),
                        ('Content-Length', str(len(errorText)))]
    start_response('500 INTERNAL SERVER ERROR', response_headers)

    return [errorText]

  rowData = [];
  rows = cur.fetchall()
  
  resultString = '{"results": '+json.dumps(rows)+'}'
  #resultString = string.replace(resultString,'"bbox": "[','"bbox": [')
  #resultString = string.replace(resultString,']",','],')

  #we need to add the name of the callback function if the parameter was specified
  if "cb" in request.params:
    resultString = request.params["cb"] + '(' + resultString + ')'

  response = Response(resultString,"200 OK",[("Content-type","text/plain; charset=utf-8"),("Content-length", str(len(resultString)) )])

  conn.close()

  return response(environ, start_response)


